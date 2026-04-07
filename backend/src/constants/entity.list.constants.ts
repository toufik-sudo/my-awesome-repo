import { User } from '../user/entity/user.entity';

import { UserAddress } from '../user/entity/user.userAddress.entity';
import { ManagerPermission } from '../user/entity/manager-permission.entity';
import { HyperManagerPermission } from '../user/entity/hyper-manager-permission.entity';
import { GuestPermission } from '../user/entity/guest-permission.entity';
import { Property } from '../properties/entity/property.entity';
import { PropertyImage } from '../properties/entity/property-image.entity';
import { PropertyAvailability } from '../properties/entity/property-availability.entity';
import { PropertyGroup } from '../properties/entity/property-group.entity';
import { PropertyGroupMembership } from '../properties/entity/property-group-membership.entity';
import { VerificationDocument } from '../properties/entity/verification-document.entity';
import { Booking } from '../bookings/entity/booking.entity';
import { Review } from '../reviews/entity/review.entity';
import { Favorite } from '../favorites/entity/favorite.entity';
import { Comment } from '../comments/entity/comment.entity';
import { Reaction } from '../reactions/entity/reaction.entity';
import { Ranking } from '../rankings/entity/ranking.entity';
import { Profile } from '../profiles/entity/profile.entity';
import { Notification } from '../notification/entity/notification.entity';
import { TourismService } from '../services/entity/tourism-service.entity';
import { UserPoints, PointTransaction } from '../modules/points/entity/user-points.entity';
import { Badge, UserBadge } from '../modules/points/entity/badge.entity';

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
  PropertyGroupMembership,
  VerificationDocument,
  Booking,
  Review,
  Favorite,
  Comment,
  Reaction,
  Ranking,
  Profile,
  Notification,
  TourismService,
  UserPoints,
  PointTransaction,
  Badge,
  UserBadge,
];
