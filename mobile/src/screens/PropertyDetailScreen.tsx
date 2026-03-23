import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { TrustBadge, DiscountBadge, Badge, DocumentUploader } from '@/components';
import { propertiesApi } from '@/services/properties.api';
import type { Property, VerificationDocument } from '@/types/property.types';
import { spacing } from '@/constants/theme.constants';

interface PropertyDetailScreenProps {
  route?: { params: { propertyId: string } };
  navigation?: any;
}

const { width } = Dimensions.get('window');

export const PropertyDetailScreen: React.FC<PropertyDetailScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const propertyId = route?.params?.propertyId || '';

  const [property, setProperty] = useState<Property | null>(null);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const [propertyData, docsData] = await Promise.all([
        propertiesApi.getById(propertyId),
        propertiesApi.getDocuments(propertyId),
      ]);
      setProperty(propertyData);
      setDocuments(docsData);
    } catch (error) {
      console.error('Failed to fetch property:', error);
    } finally {
      setLoading(false);
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
  ruleItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default PropertyDetailScreen;
