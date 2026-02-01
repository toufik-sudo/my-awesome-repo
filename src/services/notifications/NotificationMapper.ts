// -----------------------------------------------------------------------------
// NotificationMapper Service
// Maps notification data for display
// Migrated from old_app/src/services/notifications/NotificationMapper.ts
// -----------------------------------------------------------------------------

import { format } from 'date-fns';
import { NOTIFICATION, NOTIFICATION_STATUS } from '@/constants/notifications';
import {
  DASHBOARD_ROUTE,
  SETTINGS_ROUTE,
  USER_DECLARATIONS_ROUTE,
  USERS_ROUTE,
  WALL_ROUTE,
  NOTIFICATIONS_ROUTE
} from '@/constants/routes';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface NotificationRaw {
  id: string | number;
  category: number | string;
  type: number;
  status: number;
  createdAt: string | Date;
  targetId?: string | number;
  generatedBy?: {
    id: string | number;
    firstName: string;
    lastName: string;
    croppedPicture?: string;
  };
  program?: {
    id: number;
    name: string;
  };
  platform?: {
    id: number;
    name: string;
  };
  data?: Record<string, any>;
}

export interface NotificationMapped {
  id: string;
  url?: string;
  username?: string;
  date: string;
  hour: string;
  isNew: boolean;
  title?: string;
  role?: string;
  intlValues?: Record<string, any>;
  isTitleFirst?: boolean;
  isIntl?: boolean;
  onHandle?: () => void;
}

export interface NotificationMapperConfig {
  navigate: (path: string) => void;
  dispatch?: (action: any) => void;
  forceActiveProgram?: (params: { programId?: number; forcedPlatformId?: number; unlockSelection?: boolean }) => any;
  setOnRedirectData?: (data: any) => any;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DATE_FORMAT = 'dd/MM/yy';
const TIME_FORMAT = 'HH\'h\'mm';

const REDIRECT_DATA_TYPE = {
  SHOW_POST: 'showPost',
  SHOW_CONFIDENTIALITY: 'showConfidentiality'
} as const;

// -----------------------------------------------------------------------------
// Mapper Class
// -----------------------------------------------------------------------------

export class NotificationMapper {
  private readonly navigate: (path: string) => void;
  private readonly dispatch?: (action: any) => void;
  private readonly forceActiveProgram?: NotificationMapperConfig['forceActiveProgram'];
  private readonly setOnRedirectData?: NotificationMapperConfig['setOnRedirectData'];

  private static NOTIFICATION_IDENTIFIERS = Object.values(NOTIFICATION);

  constructor(config: NotificationMapperConfig) {
    this.navigate = config.navigate;
    this.dispatch = config.dispatch;
    this.forceActiveProgram = config.forceActiveProgram;
    this.setOnRedirectData = config.setOnRedirectData;
  }

  /**
   * Maps raw notification data to display format
   */
  public mapNotificationData = (notification: NotificationRaw): NotificationMapped | null => {
    if (!notification) {
      return null;
    }

    const baseData = this.mapBaseData(notification);
    const notificationIdentifier = this.getNotificationIdentifier(notification);
    
    if (!notificationIdentifier) {
      return null;
    }

    const specificData = this.getSpecificData(notificationIdentifier.id, notification);
    const baseDataWithId = { ...baseData, id: notificationIdentifier.id } as NotificationMapped;
    
    return { ...baseDataWithId, ...specificData };
  };

  private getNotificationIdentifier(notification: NotificationRaw) {
    return NotificationMapper.NOTIFICATION_IDENTIFIERS.find(
      ({ category, type }) => 
        category === notification.category && type === notification.type
    );
  }

  private mapBaseData = (notification: NotificationRaw): Partial<NotificationMapped> => {
    const { generatedBy, createdAt, status, program, data } = notification;
    const parsedDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

    return {
      url: generatedBy?.croppedPicture,
      username: this.getUsername(generatedBy),
      date: format(parsedDate, DATE_FORMAT),
      hour: format(parsedDate, TIME_FORMAT),
      isNew: status === NOTIFICATION_STATUS.UNREAD,
      title: program?.name,
      role: data?.role
    };
  };

  private getUsername = (generatedBy?: NotificationRaw['generatedBy']): string | undefined => {
    if (!generatedBy) return undefined;
    return `${generatedBy.firstName} ${generatedBy.lastName}`;
  };

  private onSelectProgramRedirect = (program?: { id: number }, redirectTo = WALL_ROUTE) => {
    return async () => {
      if (this.dispatch && this.forceActiveProgram) {
        await this.dispatch(this.forceActiveProgram({ 
          programId: program?.id, 
          unlockSelection: true 
        }));
      }
      this.navigate(redirectTo);
    };
  };

  private onSelectPlatformRedirect = (platformId?: number, redirectTo = WALL_ROUTE) => {
    return async () => {
      if (this.dispatch && this.forceActiveProgram) {
        await this.dispatch(this.forceActiveProgram({ 
          forcedPlatformId: platformId, 
          unlockSelection: true 
        }));
      }
      this.navigate(redirectTo);
    };
  };

  private onSelectPostOnProgram = (
    redirectData: { type: string; postId?: string | number; data?: any; username?: string },
    program?: { id: number }
  ) => {
    return async () => {
      if (this.dispatch) {
        if (this.setOnRedirectData) {
          this.dispatch(this.setOnRedirectData(redirectData));
        }
        if (this.forceActiveProgram) {
          await this.dispatch(this.forceActiveProgram({ programId: program?.id }));
        }
      }
      this.navigate(WALL_ROUTE);
    };
  };

  private getSpecificData(notificationId: string, notification: NotificationRaw): Partial<NotificationMapped> {
    const { program, platform, targetId, data, generatedBy } = notification;

    const mappers: Record<string, () => Partial<NotificationMapped>> = {
      // Comments
      comment: () => ({
        id: 'comment',
        onHandle: this.onSelectPostOnProgram(
          { type: REDIRECT_DATA_TYPE.SHOW_POST, postId: targetId, data },
          program
        )
      }),

      // Likes
      like: () => ({
        id: 'like',
        onHandle: this.onSelectPostOnProgram(
          { type: REDIRECT_DATA_TYPE.SHOW_POST, postId: targetId, data },
          program
        )
      }),

      // Confidentiality changes
      confidentiality: () => ({
        id: 'confidentiality',
        onHandle: this.onSelectPostOnProgram(
          { 
            type: REDIRECT_DATA_TYPE.SHOW_CONFIDENTIALITY, 
            postId: targetId, 
            data,
            username: this.getUsername(generatedBy)
          },
          program
        )
      }),

      // Actions
      actions: () => ({
        id: 'actions',
        onHandle: this.onSelectProgramRedirect(program, USER_DECLARATIONS_ROUTE),
        username: undefined
      }),

      // Ranking
      ranking: () => ({
        id: 'ranking',
        onHandle: this.onSelectProgramRedirect(program, USERS_ROUTE),
        username: undefined
      }),

      // Rewards
      rewards: () => ({
        id: 'rewards',
        onHandle: this.onSelectProgramRedirect(program, DASHBOARD_ROUTE),
        url: undefined,
        isTitleFirst: true,
        username: undefined
      }),

      // User goals
      userGoals: () => ({
        id: 'userGoals',
        onHandle: this.onSelectProgramRedirect(program),
        url: undefined,
        isTitleFirst: true,
        username: undefined
      }),

      // Declaration validated
      declarationValidated: () => ({
        id: 'declarationValidated',
        onHandle: this.onSelectProgramRedirect(program, `${USER_DECLARATIONS_ROUTE}/${targetId}`)
      }),

      // Declaration rejected
      declarationRejected: () => ({
        id: 'declarationRejected',
        onHandle: this.onSelectProgramRedirect(program, `${USER_DECLARATIONS_ROUTE}/${targetId}`)
      }),

      // Points
      points: () => ({
        id: 'points',
        onHandle: this.onSelectProgramRedirect(program, `${WALL_ROUTE}/points`),
        username: undefined
      }),

      // New security role
      newSecurityRole: () => ({
        id: 'newSecurityRole',
        onHandle: this.onSelectPlatformRedirect(platform?.id, `${WALL_ROUTE}${SETTINGS_ROUTE}/administrators`),
        title: platform?.name
      }),

      // New people manager
      newPeopleManager: () => ({
        id: 'newPeopleManager',
        onHandle: this.onSelectProgramRedirect(program),
        title: program?.name
      }),

      // Blocked from program
      blockedFromProgram: () => ({
        id: 'blockedFromProgram',
        url: undefined,
        username: undefined
      }),

      // Platform role updated
      platformRoleUpdate: () => ({
        id: 'platformRoleUpdate',
        onHandle: this.onSelectPlatformRedirect(platform?.id, `${WALL_ROUTE}${SETTINGS_ROUTE}/administrators`),
        username: undefined,
        url: undefined,
        title: platform?.name
      }),

      // First declaration
      firstDeclaration: () => ({
        id: 'firstDeclaration',
        onHandle: this.onSelectProgramRedirect(program),
        url: undefined,
        username: undefined
      }),

      // Program milestones
      programHas100Declarations: () => ({
        id: 'programHas100Declarations',
        onHandle: this.onSelectProgramRedirect(program),
        isTitleFirst: true,
        url: undefined,
        username: undefined
      }),

      programHas1000Declarations: () => ({
        id: 'programHas1000Declarations',
        onHandle: this.onSelectProgramRedirect(program),
        isTitleFirst: true,
        url: undefined,
        username: undefined
      }),

      // New participant
      newParticipant: () => ({
        id: 'newParticipant',
        onHandle: this.onSelectProgramRedirect(program, USERS_ROUTE),
        url: undefined,
        username: undefined
      }),

      // Program started
      adminProgramStarted: () => ({
        id: 'adminProgramStarted',
        onHandle: this.onSelectProgramRedirect(program),
        isTitleFirst: true,
        username: undefined,
        url: undefined
      }),

      // Points converted
      pointsConverted: () => ({
        id: 'pointsConverted',
        onHandle: this.onSelectProgramRedirect(program, `${WALL_ROUTE}/points`),
        username: undefined,
        intlValues: data || { points: null, operation: null }
      }),

      // Plan limit reached
      planLimitReached: () => ({
        id: 'planLimitReached',
        onHandle: this.onSelectPlatformRedirect(platform?.id, `${WALL_ROUTE}${SETTINGS_ROUTE}/payment`),
        url: undefined,
        username: undefined,
        isIntl: true,
        title: 'notifications.label.upgradeNow'
      }),

      // Point conversion validated
      pointsConversionValidated: () => ({
        id: 'pointsConversionValidated',
        onHandle: this.onSelectProgramRedirect(program, `${WALL_ROUTE}/points`),
        username: undefined,
        intlValues: data || { points: null, operation: null },
        isTitleFirst: true
      }),

      // Subscription payment
      subscriptionPayment: () => ({
        id: 'subscriptionPayment',
        onHandle: this.onSelectProgramRedirect(program, `${WALL_ROUTE}${SETTINGS_ROUTE}/payment`),
        url: undefined,
        username: undefined
      })
    };

    return mappers[notificationId]?.() || { id: notificationId };
  }
}

export default NotificationMapper;
