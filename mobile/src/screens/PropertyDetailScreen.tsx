import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { TrustBadge, DiscountBadge, Badge, DocumentUploader, CommentSkeletonList } from '@/components';
import { propertiesApi } from '@/services/properties.api';
import { socialApi, type CommentItem } from '@/services/social.api';
import { usePermissions } from '@/hooks/usePermissions';
import { CommentReactions } from '@/components/CommentReactions';
import type { Property, VerificationDocument } from '@/types/property.types';
import { spacing } from '@/constants/theme.constants';

interface PropertyDetailScreenProps {
  route?: { params: { propertyId: string } };
  navigation?: any;
}

const { width } = Dimensions.get('window');

export const PropertyDetailScreen: React.FC<PropertyDetailScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { MOBILE_UI_PERM: PERM, canUI, permissionsLoaded } = usePermissions();
  const propertyId = route?.params?.propertyId || '';

  const [property, setProperty] = useState<Property | null>(null);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  const COMMENTS_LIMIT = 10;

  const canViewComments = canUI(PERM.COMMENT_VIEW);
  const canCreateComment = canUI(PERM.COMMENT_CREATE);
  const canReact = canUI(PERM.REACTION_TOGGLE);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  /** Token bumped on every reset; appends with stale tokens are dropped. */
  const commentsResetToken = useRef(0);

  const loadComments = async (page: number, mode: 'reset' | 'append') => {
    if (!canViewComments) return;
    if (mode === 'append' && commentsLoading) return;
    let myToken = commentsResetToken.current;
    if (mode === 'reset') {
      commentsResetToken.current += 1;
      myToken = commentsResetToken.current;
      // Wipe state synchronously — prevents end-of-list flicker during refresh.
      setComments([]);
      setCommentsPage(1);
      setCommentsTotalPages(1);
      setCommentsTotal(0);
    }
    try {
      setCommentsLoading(true);
      const res = await socialApi.getCommentsPaginated('property', propertyId, { page, limit: COMMENTS_LIMIT });
      if (myToken !== commentsResetToken.current) return; // stale
      setCommentsPage(res.page);
      setCommentsTotalPages(res.totalPages);
      setCommentsTotal(res.total);
      setComments((prev) => {
        if (mode === 'reset') return res.data;
        // Dedupe by id when appending — protects against double-emit / double-tap.
        const seen = new Set(prev.map((c) => c.id));
        const additions = res.data.filter((c) => !seen.has(c.id));
        return [...prev, ...additions];
      });
    } catch (e) {
      if (myToken === commentsResetToken.current && mode === 'reset') setComments([]);
    } finally {
      if (myToken === commentsResetToken.current) setCommentsLoading(false);
    }
  };

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const [propertyData, docsData] = await Promise.all([
        propertiesApi.getById(propertyId),
        propertiesApi.getDocuments(propertyId),
      ]);
      setProperty(propertyData);
      setDocuments(docsData);
      if (canViewComments) {
        loadComments(1, 'reset');
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!commentDraft.trim() || postingComment) return;
    try {
      setPostingComment(true);
      await socialApi.createComment({ targetType: 'property', targetId: propertyId, content: commentDraft.trim() });
      setCommentDraft('');
      loadComments(1, 'reset');
    } catch (e) {
      console.error('Failed to post comment', e);
    } finally {
      setPostingComment(false);
    }
  };

  const formatPrice = (price: number, currency = 'DZD') => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!property) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.foreground, textAlign: 'center', marginTop: 40 }}>
          Property not found
        </Text>
      </SafeAreaView>
    );
  }

  const imageUrl = property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: imageUrl }} style={styles.heroImage} />
          {/* Trust Badge Overlay */}
          <View style={styles.trustOverlay}>
            <TrustBadge trustStars={property.trustStars} size="md" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Location */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.foreground }]}>{property.title}</Text>
            <Text style={[styles.location, { color: theme.mutedForeground }]}>
              📍 {property.city}, {property.wilaya}, {property.country}
            </Text>
            <View style={styles.badges}>
              <Badge label={property.propertyType} variant="secondary" />
              {property.instantBooking && <Badge label="Instant Book" variant="success" />}
            </View>
          </View>

          {/* Pricing */}
          <View style={[styles.priceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View>
              <Text style={[styles.price, { color: theme.primary }]}>
                {formatPrice(property.pricePerNight, property.currency)}
                <Text style={{ color: theme.mutedForeground, fontSize: 14 }}> /night</Text>
              </Text>
              <DiscountBadge
                weeklyDiscount={property.weeklyDiscount}
                monthlyDiscount={property.monthlyDiscount}
                size="md"
              />
            </View>
            <TouchableOpacity style={[styles.bookButton, { backgroundColor: theme.primary }]}>
              <Text style={{ color: theme.primaryForeground, fontWeight: '700', fontSize: 16 }}>
                Book Now
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.foreground }]}>{property.maxGuests}</Text>
              <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>Guests</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.foreground }]}>{property.bedrooms}</Text>
              <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>Bedrooms</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.foreground }]}>{property.bathrooms}</Text>
              <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>Bathrooms</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.foreground }]}>
                ⭐ {property.averageRating > 0 ? property.averageRating.toFixed(1) : 'New'}
              </Text>
              <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>
                {property.reviewCount} reviews
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Description</Text>
            <Text style={[styles.description, { color: theme.foreground }]}>{property.description}</Text>
          </View>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {property.amenities.map((amenity, idx) => (
                  <View key={idx} style={[styles.amenityChip, { backgroundColor: theme.muted }]}>
                    <Text style={{ color: theme.foreground, fontSize: 12 }}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Verification Documents Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>Verification Status</Text>
              <TouchableOpacity onPress={() => setShowUploader(!showUploader)}>
                <Text style={{ color: theme.primary, fontSize: 13 }}>
                  {showUploader ? 'Hide Uploader' : '+ Upload Documents'}
                </Text>
              </TouchableOpacity>
            </View>
            <TrustBadge trustStars={property.trustStars} size="lg" />
            
            {documents.length > 0 && (
              <View style={styles.docsGrid}>
                {documents.map((doc) => (
                  <View
                    key={doc.id}
                    style={[
                      styles.docItem,
                      {
                        backgroundColor: theme.card,
                        borderColor:
                          doc.status === 'approved'
                            ? '#22c55e'
                            : doc.status === 'rejected'
                            ? theme.destructive
                            : theme.border,
                      },
                    ]}
                  >
                    <Text style={{ color: theme.foreground, fontSize: 12, fontWeight: '600' }}>
                      {doc.type.replace('_', ' ')}
                    </Text>
                    <Badge
                      label={doc.status}
                      variant={
                        doc.status === 'approved'
                          ? 'success'
                          : doc.status === 'rejected'
                          ? 'destructive'
                          : 'outline'
                      }
                    />
                    {doc.aiAnalyzed && (
                      <Text style={{ color: theme.mutedForeground, fontSize: 10 }}>
                        AI: {Math.round((doc.aiConfidence || 0) * 100)}%
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {showUploader && (
              <View style={styles.uploaderContainer}>
                <DocumentUploader propertyId={propertyId} onUploadComplete={fetchPropertyDetails} />
              </View>
            )}
          </View>

          {/* Comments (RBAC-gated, paginated) */}
          {canViewComments && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>
                Comments ({commentsTotal || comments.length})
              </Text>
              {/* Initial-load skeleton (no comments yet, loading first page). */}
              {commentsLoading && comments.length === 0 && <CommentSkeletonList count={3} />}

              {comments.length === 0 && !commentsLoading && (
                <Text style={{ color: theme.mutedForeground, fontSize: 13 }}>No comments yet.</Text>
              )}
              {comments.map((c) => (
                <View key={c.id} style={[styles.commentItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={{ color: theme.foreground, fontWeight: '600', fontSize: 13 }}>{c.userName || 'User'}</Text>
                  <Text style={{ color: theme.foreground, fontSize: 13, marginTop: 2 }}>{c.content}</Text>
                  <Text style={{ color: theme.mutedForeground, fontSize: 11, marginTop: 4 }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </Text>
                  {/* Per-comment reactions (RBAC: REACTION_TOGGLE) */}
                  <CommentReactions commentId={c.id} canToggle={canReact} />
                </View>
              ))}

              {/* Page-change skeleton: appended page is loading. */}
              {commentsLoading && comments.length > 0 && <CommentSkeletonList count={2} />}

              {!commentsLoading && commentsPage < commentsTotalPages ? (
                <TouchableOpacity
                  onPress={() => loadComments(commentsPage + 1, 'append')}
                  style={[styles.loadMoreBtn, { borderColor: theme.border }]}
                >
                  <Text style={{ color: theme.primary, fontWeight: '600' }}>Load more comments</Text>
                </TouchableOpacity>
              ) : !commentsLoading && comments.length > 0 && commentsPage >= commentsTotalPages ? (
                <View style={styles.endIndicator}>
                  <View style={[styles.endLine, { backgroundColor: theme.border }]} />
                  <Text style={[styles.endText, { color: theme.mutedForeground }]}>
                    — End of comments —
                  </Text>
                  <View style={[styles.endLine, { backgroundColor: theme.border }]} />
                </View>
              ) : null}

              {canCreateComment && (
                <View style={styles.commentComposer}>
                  <TextInput
                    value={commentDraft}
                    onChangeText={setCommentDraft}
                    placeholder="Write a comment…"
                    placeholderTextColor={theme.mutedForeground}
                    style={[styles.commentInput, { color: theme.foreground, backgroundColor: theme.card, borderColor: theme.border }]}
                    multiline
                  />
                  <TouchableOpacity
                    disabled={!commentDraft.trim() || postingComment}
                    onPress={submitComment}
                    style={[styles.commentSend, { backgroundColor: theme.primary, opacity: !commentDraft.trim() ? 0.5 : 1 }]}
                  >
                    <Text style={{ color: theme.primaryForeground, fontWeight: '700' }}>{postingComment ? '…' : 'Post'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* House Rules */}
          {property.houseRules?.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.foreground }]}>House Rules</Text>
              {property.houseRules.map((rule, idx) => (
                <Text key={idx} style={[styles.ruleItem, { color: theme.foreground }]}>
                  • {rule}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 100,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: 280,
    resizeMode: 'cover',
  },
  trustOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  content: {
    padding: spacing.lg,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
  },
  bookButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  docsGrid: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  docItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    gap: 4,
  },
  uploaderContainer: {
    marginTop: spacing.md,
  },
  commentItem: { padding: 10, borderRadius: 8, borderWidth: 1, marginTop: 8 },
  loadMoreBtn: { marginTop: 10, paddingVertical: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  endIndicator: { flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 8 },
  endLine: { flex: 1, height: 1 },
  endText: { fontSize: 12, fontStyle: 'italic' },
  commentComposer: { flexDirection: 'row', gap: 8, marginTop: 12, alignItems: 'flex-end' },
  commentInput: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, maxHeight: 80 },
  commentSend: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  ruleItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default PropertyDetailScreen;
