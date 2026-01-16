import MomentUtilities from 'utils/MomentUtilities';
import {
  NOTIFICATION,
  NOTIFICATION_FORMAT_DATE,
  NOTIFICATION_FORMAT_TIME,
  NOTIFICATION_STATUS
} from 'constants/notifications/notifications';
import {
  DASHBOARD_ROUTE,
  SETTINGS,
  USER_DECLARATIONS_ROUTE,
  USERS_ROUTE,
  WALL,
  WALL_BENEFICIARY_POINTS_ROUTE,
  WALL_ROUTE
} from 'constants/routes';
import { forceActiveProgram, setOnRedirectData } from 'store/actions/wallActions';
import { REDIRECT_DATA_TYPE } from 'constants/general';
import { ADMINISTRATORS, PAYMENT } from 'constants/wall/settings';

/**
 * Mapper used for returning the data needed for displaying each notification
 */
class NotificationMapper {
  private static NOTIFICATION_IDENTIFIERS = Object.values(NOTIFICATION);

  private readonly dispatch;
  private readonly history;

  constructor(dispatch, history) {
    this.dispatch = dispatch;
    this.history = history;
  }

  public mapNotificationData = notification => {
    if (!notification) {
      return {};
    }
    const baseData = this.mapBaseData(notification);
    const notificationIdentifier = this.getNotificationIdentifier(notification);
    if (!notificationIdentifier) {
      return {};
    }
    return { ...baseData, ...this.targetMapper[notificationIdentifier.id](notification) };
  };

  private getNotificationIdentifier({ category, type }) {
    return NotificationMapper.NOTIFICATION_IDENTIFIERS.find(
      ({ category: ownCategory, type: ownType }) => category === ownCategory && ownType === type
    );
  }

  private mapBaseData = ({ generatedBy, createdAt, status, program, data }) => {
    return {
      url: generatedBy && generatedBy.croppedPicture,
      username: this.getUsername(generatedBy),
      date: MomentUtilities.formatDate(createdAt, NOTIFICATION_FORMAT_DATE),
      hour: MomentUtilities.formatDate(createdAt, NOTIFICATION_FORMAT_TIME),
      isNew: this.isNew(status),
      title: program && program.name,
      role: data && data.role
    };
  };

  private isNew = status => NOTIFICATION_STATUS.UNREAD === status;

  private getUsername = generatedBy => generatedBy && `${generatedBy.firstName} ${generatedBy.lastName}`;

  private onSelectProgramRedirect = (program, redirectTo = WALL_ROUTE) => async () => {
    await this.dispatch(forceActiveProgram({ programId: program && program.id, unlockSelection: true }));
    this.history.push({ pathname: redirectTo });
  };

  private onSelectPlatformRedirect = (forcedPlatformId, redirectTo = WALL_ROUTE) => async () => {
    await this.dispatch(forceActiveProgram({ forcedPlatformId, unlockSelection: true }));
    this.history.push({ pathname: redirectTo });
  };

  private onSelectPostOnProgram = (redirectData, program) => async () => {
    this.dispatch(setOnRedirectData(redirectData));
    await this.dispatch(forceActiveProgram({ programId: program && program.id }));
    this.history.push({ pathname: WALL_ROUTE });
  };

  private mapUserGoalsCta = ({ program }) => {
    return {
      id: NOTIFICATION.USER_GOALS.id,
      onHandle: this.onSelectProgramRedirect(program),
      url: null,
      isTitleFirst: true,
      username: null
    };
  };

  private mapRewardsCta = ({ program }: any) => {
    return {
      id: NOTIFICATION.REWARDS.id,
      onHandle: this.onSelectProgramRedirect(program, DASHBOARD_ROUTE),
      url: null,
      isTitleFirst: true,
      username: null
    };
  };

  private mapRankingChangeCta = ({ program }) => {
    return {
      id: NOTIFICATION.RANKING.id,
      onHandle: this.onSelectProgramRedirect(program, USERS_ROUTE),
      username: null
    };
  };

  private mapActionsCta = ({ program }) => {
    return {
      id: NOTIFICATION.ACTIONS.id,
      onHandle: this.onSelectProgramRedirect(program, USER_DECLARATIONS_ROUTE),
      username: null
    };
  };

  private mapLikeCta = ({ program, targetId: postId, data }) => {
    const redirectData = { type: REDIRECT_DATA_TYPE.SHOW_POST, postId, data };
    return {
      id: NOTIFICATION.ADD_LIKE.id,
      onHandle: this.onSelectPostOnProgram(redirectData, program)
    };
  };

  private mapConfidentialityChangeCta = ({ program, targetId: postId, data, generatedBy }) => {
    const redirectData = {
      type: REDIRECT_DATA_TYPE.SHOW_CONFIDENTIALITY,
      postId,
      data,
      username: this.getUsername(generatedBy)
    };
    return {
      id: NOTIFICATION.EDIT_POST.id,
      onHandle: this.onSelectPostOnProgram(redirectData, program)
    };
  };

  private mapCommentCta = ({ program, targetId: postId, data }) => {
    const redirectData = { type: REDIRECT_DATA_TYPE.SHOW_POST, postId, data };
    return {
      id: NOTIFICATION.ADD_COMMENTS.id,
      onHandle: this.onSelectPostOnProgram(redirectData, program)
    };
  };

  private mapDeclarationsValidatedCta = ({ program, targetId }) => {
    return {
      id: NOTIFICATION.DECLARATION_VALIDATED.id,
      onHandle: this.onSelectProgramRedirect(program, `${USER_DECLARATIONS_ROUTE}/${targetId}`)
    };
  };

  private mapDeclarationsRejectedCta = ({ program, targetId }) => {
    return {
      id: NOTIFICATION.DECLARATION_REJECTED.id,
      onHandle: this.onSelectProgramRedirect(program, `${USER_DECLARATIONS_ROUTE}/${targetId}`)
    };
  };

  private mapPointsCta = ({ program }) => {
    return {
      id: NOTIFICATION.POINTS.id,
      onHandle: this.onSelectProgramRedirect(program, WALL_BENEFICIARY_POINTS_ROUTE),
      username: null
    };
  };

  private mapFirstDeclaration = ({ program }) => {
    return {
      id: NOTIFICATION.FIRST_DECLARATION_ON_PROGRAM.id,
      onHandle: this.onSelectProgramRedirect(program),
      url: null,
      username: null
    };
  };

  private mapFirst100Declaration = ({ program }) => {
    return {
      id: NOTIFICATION.PROGRAM_HAS_100_DECLARATIONS.id,
      onHandle: this.onSelectProgramRedirect(program),
      isTitleFirst: true,
      url: null,
      username: null
    };
  };

  private mapFirst1000Declaration = ({ program }) => {
    return {
      id: NOTIFICATION.PROGRAM_HAS_1000_DECLARATIONS.id,
      onHandle: this.onSelectProgramRedirect(program),
      isTitleFirst: true,
      url: null,
      username: null
    };
  };

  private mapBlockedFromProgram = () => {
    return {
      id: NOTIFICATION.BLOCKED_FROM_PROGRAM.id,
      url: null,
      username: null
    };
  };

  private mapNewSecurityRole = ({ platform }) => {
    return {
      id: NOTIFICATION.NEW_SECURITY_ROLE.id,
      onHandle: this.onSelectPlatformRedirect(platform && platform.id, `/${WALL}${SETTINGS}/${ADMINISTRATORS}`),
      title: platform && platform.name
    };
  };

  private mapNewPeopleManagerRole = ({ program }) => {
    return {
      id: NOTIFICATION.NEW_PEOPLE_MANAGER.id,
      onHandle: this.onSelectProgramRedirect(program),
      title: program && program.name
    };
  };

  private mapNewPlatformRole = ({ platform }) => {
    return {
      id: NOTIFICATION.NEW_PLATFORM_ROLE.id,
      onHandle: this.onSelectPlatformRedirect(platform && platform.id, `/${WALL}${SETTINGS}/${ADMINISTRATORS}`),
      username: null,
      url: null,
      title: platform && platform.name
    };
  };

  private mapSubscriptionPayment = ({ program }) => {
    return {
      id: NOTIFICATION.SUBSCRIPTION_PAYMENT.id,
      onHandle: this.onSelectProgramRedirect(program, `/${WALL}${SETTINGS}/${PAYMENT}`),
      url: null,
      username: null
    };
  };

  private mapNewParticipant = ({ program }) => {
    return {
      id: NOTIFICATION.NEW_PARTICIPANT.id,
      onHandle: this.onSelectProgramRedirect(program, USERS_ROUTE),
      url: null,
      username: null
    };
  };

  private mapProgramStarted = ({ program }) => {
    return {
      id: NOTIFICATION.PROGRAM_HAS_STARTED.id,
      onHandle: this.onSelectProgramRedirect(program),
      isTitleFirst: true,
      username: null,
      url: null
    };
  };

  private mapPointsConverted = ({ program, data }) => {
    return {
      id: NOTIFICATION.POINTS_CONVERTED.id,
      onHandle: this.onSelectProgramRedirect(program, WALL_BENEFICIARY_POINTS_ROUTE),
      username: null,
      intlValues: data || { points: null, operation: null }
    };
  };

  private mapPlanLimitReached = ({ platform }) => {
    return {
      id: NOTIFICATION.PLAN_LIMIT_REACHED.id,
      onHandle: this.onSelectPlatformRedirect(platform.id, `/${WALL}${SETTINGS}/${PAYMENT}`),
      url: null,
      username: null,
      isIntl: true,
      title: 'notifications.label.upgradeNow'
    };
  };

  private mapPointConversionValidated = ({ program, data }) => {
    return {
      id: NOTIFICATION.POINT_CONVERSION_VALIDATED.id,
      onHandle: this.onSelectProgramRedirect(program, WALL_BENEFICIARY_POINTS_ROUTE),
      username: null,
      intlValues: data || { points: null, operation: null },
      isTitleFirst: true
    };
  };

  private targetMapper = {
    [NOTIFICATION.ADD_COMMENTS.id]: this.mapCommentCta,
    [NOTIFICATION.ADD_LIKE.id]: this.mapLikeCta,
    [NOTIFICATION.EDIT_POST.id]: this.mapConfidentialityChangeCta,
    [NOTIFICATION.ACTIONS.id]: this.mapActionsCta,
    [NOTIFICATION.REWARDS.id]: this.mapRewardsCta,
    [NOTIFICATION.RANKING.id]: this.mapRankingChangeCta,
    [NOTIFICATION.USER_GOALS.id]: this.mapUserGoalsCta,
    [NOTIFICATION.NEW_SECURITY_ROLE.id]: this.mapNewSecurityRole,
    [NOTIFICATION.NEW_PEOPLE_MANAGER.id]: this.mapNewPeopleManagerRole,
    [NOTIFICATION.BLOCKED_FROM_PROGRAM.id]: this.mapBlockedFromProgram,
    [NOTIFICATION.DECLARATION_VALIDATED.id]: this.mapDeclarationsValidatedCta,
    [NOTIFICATION.DECLARATION_REJECTED.id]: this.mapDeclarationsRejectedCta,
    [NOTIFICATION.FIRST_DECLARATION_ON_PROGRAM.id]: this.mapFirstDeclaration,
    [NOTIFICATION.PROGRAM_HAS_100_DECLARATIONS.id]: this.mapFirst100Declaration,
    [NOTIFICATION.PROGRAM_HAS_1000_DECLARATIONS.id]: this.mapFirst1000Declaration,
    [NOTIFICATION.POINTS.id]: this.mapPointsCta,
    [NOTIFICATION.NEW_PLATFORM_ROLE.id]: this.mapNewPlatformRole,
    [NOTIFICATION.SUBSCRIPTION_PAYMENT.id]: this.mapSubscriptionPayment,
    [NOTIFICATION.NEW_PARTICIPANT.id]: this.mapNewParticipant,
    [NOTIFICATION.PROGRAM_HAS_STARTED.id]: this.mapProgramStarted,
    [NOTIFICATION.POINTS_CONVERTED.id]: this.mapPointsConverted,
    [NOTIFICATION.PLAN_LIMIT_REACHED.id]: this.mapPlanLimitReached,
    [NOTIFICATION.POINT_CONVERSION_VALIDATED.id]: this.mapPointConversionValidated
  };
}

export default NotificationMapper;
