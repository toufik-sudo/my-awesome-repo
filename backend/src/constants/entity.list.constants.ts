import { User } from '../user/entity/user.entity';
import { UserAddress } from '../user/entity/user.userAddress.entity';
import { ManagerPermission } from '../user/entity/manager-permission.entity';
import { HyperManagerPermission } from '../user/entity/hyper-manager-permission.entity';
import { GuestPermission } from '../user/entity/guest-permission.entity';
import { Property } from '../properties/entity/property.entity';
import { PropertyImage } from '../properties/entity/property-image.entity';
import { PropertyAvailability } from '../properties/entity/property-availability.entity';
import { PropertyGroup } from '../properties/entity/property-group.entity';
import { VerificationDocument } from '../properties/entity/verification-document.entity';
import { Booking } from '../bookings/entity/booking.entity';
import { Review } from '../reviews/entity/review.entity';
import { Favorite } from '../favorites/entity/favorite.entity';
import { ServiceFavorite } from '../favorites/entity/service-favorite.entity';
import { Comment } from '../comments/entity/comment.entity';
import { CommentService } from '../comments/entity/comment-service.entity';
import { Reaction } from '../reactions/entity/reaction.entity';
import { Ranking } from '../rankings/entity/ranking.entity';
import { Profile } from '../profiles/entity/profile.entity';
import { Notification } from '../notification/entity/notification.entity';
import { TourismService } from '../services/entity/tourism-service.entity';
import { ServiceGroup } from '../services/entity/service-group.entity';
import { ServiceBooking } from '../services/entity/service-booking.entity';
import { ServiceVerificationDocument } from '../services/entity/service-verification-document.entity';
import { ServiceAvailability } from '../services/entity/service-availability.entity';
import { UserPoints, PointTransaction } from '../modules/points/entity/user-points.entity';
import { Badge, BadgeUser } from '../modules/points/entity/badge.entity';
import { RbacBackendPermission } from '../user/entity/rbac-backend-permission.entity';
import { RbacFrontendPermission } from '../user/entity/rbac-frontend-permission.entity';
import { RbacPermissionBinding } from '../user/entity/rbac-permission-binding.entity';
import { CancellationRule } from '../user/entity/cancellation-rule.entity';
import { HostFeeAbsorption } from '../user/entity/host-fee-absorption.entity';
import { ServiceFeeRule } from '../user/entity/service-fee-rule.entity';
import { PointsRule } from '../user/entity/points-rule.entity';
import { PaymentReceipt } from '../payments/entity/payment-receipt.entity';
import { TransferAccount } from '../payments/entity/transfer-account.entity';
import { PlatformAccount } from '../payments/entity/platform-account.entity';
import { HostPayout } from '../payments/entity/host-payout.entity';
import { BookingDispute } from '../payments/entity/booking-dispute.entity';
import { HostFeeDebt } from '../payments/entity/host-fee-debt.entity';
import { Referral, PropertyShare } from '../user/entity/referral.entity';
import { Invitation } from '../user/entity/invitation.entity';
import { Reward } from '../user/entity/reward.entity';
import { PayoutAccount } from '../user/entity/payout-account.entity';
import { PropertyPromo } from '../properties/entity/property-promo.entity';
import { PromoAlert } from '../properties/entity/promo-alert.entity';
import { SavedSearchAlert } from '../properties/entity/saved-search-alert.entity';

export const entityList = [
  User,
  UserAddress,
  ManagerPermission,
  HyperManagerPermission,
  GuestPermission,
  Property,
  PropertyImage,
  PropertyAvailability,
  PropertyGroup,
  VerificationDocument,
  Booking,
  Review,
  Favorite,
  ServiceFavorite,
  Comment,
  CommentService,
  Reaction,
  Ranking,
  Profile,
  Notification,
  TourismService,
  ServiceGroup,
  ServiceBooking,
  ServiceVerificationDocument,
  ServiceAvailability,
  UserPoints,
  PointTransaction,
  Badge,
  BadgeUser,
  RbacBackendPermission,
  RbacFrontendPermission,
  RbacPermissionBinding,
  CancellationRule,
  HostFeeAbsorption,
  ServiceFeeRule,
  PointsRule,
  PaymentReceipt,
  TransferAccount,
  PlatformAccount,
  HostPayout,
  BookingDispute,
  HostFeeDebt,
  Referral,
  PropertyShare,
  Invitation,
  Reward,
  PayoutAccount,
  PropertyPromo,
  PromoAlert,
  SavedSearchAlert,
];
