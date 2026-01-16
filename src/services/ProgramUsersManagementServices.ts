import { DEFAULT_OFFSET } from 'constants/api';
import { ERROR_CODES } from 'constants/api/userPrograms';

export const getManagedUsersInitialState = (userId, userProgram = { isPeopleManager: false }) => ({
  users: [],
  hasMore: false,
  loading: false,
  managerId: userProgram.isPeopleManager ? userId : null,
  managedCount: DEFAULT_OFFSET
});

/**
 * Validates user role data:
 * - no restrictions if just user
 * - if people manager: at least one user must be assigned and no errors present in users list
 * @param isPeopleManager
 * @param users
 */
export const hasValidRoleData = ({ isPeopleManager, users, managerId }) => {
  if (!isPeopleManager) {
    return true;
  }

  return isAtLeastOneUserAssigned(users, managerId) && hasNoManagedUsersError(users);
};

const isAtLeastOneUserAssigned = (users, managerId) => users.some(user => user.isManaged && user.id !== managerId);

const hasNoManagedUsersError = users => !users.some(user => !!user.error);

/**
 * Returns whether user role data has been changed for given program
 * @param userProgram
 * @param isPeopleManager
 * @param allManaged
 * @param currentUsers
 */
export const hasUserRoleDataChanged = ({ userProgram, isPeopleManager, allManaged, currentUsers }) => {
  if (!userProgram || hasKeptUserRole(userProgram, isPeopleManager)) {
    return false;
  }

  return hasBeenDowngradedToUser(userProgram, isPeopleManager) || hasManagedUsersListChanged(currentUsers, allManaged);
};

/**
 * Returns whether user's role on given program has not been upgraded to peoplemanager.
 * @param userProgram
 * @param isPeopleManager
 */
const hasKeptUserRole = (userProgram, isPeopleManager) => !userProgram.isPeopleManager && !isPeopleManager;

const hasManagedUsersListChanged = ({ users, managedCount }, allManaged) =>
  allManaged || isAtLeastOneUserRemovedOrAdded(users, managedCount);

const isAtLeastOneUserRemovedOrAdded = (users, managedCount) =>
  users.some((user, index) => (index < managedCount ? !user.isManaged : user.isManaged));

/**
 * Returns whether user's role on given program has been changed from people manager to user.
 * @param userProgram
 * @param isPeopleManager
 */
const hasBeenDowngradedToUser = (userProgram, isPeopleManager) => userProgram.isPeopleManager && !isPeopleManager;

/**
 * Computes new managed users state on single user managed status change
 * @param currentUsers
 * @param managedUserStatus
 */
export const updateManagedUsers = (currentUsers, { userIndex, managedUserId, isManaged }) => {
  const { users = [] } = currentUsers;

  if (!users[userIndex] || users[userIndex].id !== managedUserId) {
    return currentUsers;
  }

  return {
    ...currentUsers,
    users: users.map((user, index) =>
      user.id === managedUserId && index === userIndex ? updateUsersManagedStatus(user, isManaged) : user
    )
  };
};

/**
 * Sets the status for all users as managed / not managed
 * @param currentUsers
 * @param allManaged
 */
export const updateAllManagedUsers = (currentUsers, allManaged) => ({
  ...currentUsers,
  users: (currentUsers.users || []).map(user => updateUsersManagedStatus(user, allManaged))
});

const updateUsersManagedStatus = (user, isManaged) => ({ ...user, isManaged, error: undefined });

/**
 * Prepares managed users list
 * @param users
 * @param allManaged
 * @param isPeopleManager
 */
export const prepareManagedUsersData = (managerId, { users, allManaged, isPeopleManager }) => {
  if (!isPeopleManager) {
    return { users: [] };
  }

  if (allManaged) {
    return {
      users: [],
      allAvailable: true
    };
  }

  return {
    users: users.filter(user => user.isManaged && user.id !== managerId).map(user => user.id)
  };
};

export const computeNextManagedUsersLoadingParams = (page, currentUsers) => {
  if (DEFAULT_OFFSET === page) {
    return {
      users: [],
      managerId: currentUsers.managerId,
      managedCount: DEFAULT_OFFSET,
      offset: DEFAULT_OFFSET
    };
  }

  const { users, managerId, managedCount } = currentUsers;
  const offset = managerId ? users.length : users.length - managedCount;

  return {
    ...currentUsers,
    offset
  };
};

/**
 * Computes managed users list state.
 *
 * @implNote:
 * 1. users list for people manager role definition must be loaded using 2 different filter params combinations:
 *    - one for loading the users managed by the current user (ie. user for which the details are displayed)
 *    - one for loading users unassigned to any people manager, thus available to be assigned to current user
 * 2. users list is loaded on scroll
 *
 * @param loadingParams
 * @param loaddedUsers
 */
export const updateManagedUsersListState = (loadingParams, loaddedUsers, allManaged) => {
  const { managedCount, managerId, users } = loadingParams;

  let { entries } = loaddedUsers;
  if (managerId || allManaged) {
    entries = entries.filter(user => user.uuid !== managerId).map(user => ({ ...user, isManaged: true }));
  }

  return {
    users: [...users, ...entries],
    loading: false,
    hasMore: loaddedUsers.hasMore || !!managerId,
    managerId: loaddedUsers.hasMore ? managerId : null,
    // do not rely on total, as BE might not return correct results
    managedCount: managerId ? managedCount + entries.length : managedCount
  };
};

/**
 * Returns whether first page of unassigned program users should be loaded.
 * @param isPeopleManager
 * @param currentUsersState
 * @param loadingPageSize
 */
export const shouldLoadUnmanagedUsers = (isPeopleManager, currentUsersState, loadingPageSize) => {
  const { managerId, users, hasMore } = currentUsersState;
  return isPeopleManager && !managerId && hasMore && users.length < loadingPageSize;
};

export const addManagedUsersErrors = (currentUsers, invalidUsers = []) => {
  if (!invalidUsers.length) {
    return currentUsers;
  }

  const errors = invalidUsers.reduce((acc, userError) => {
    acc[userError.user] = resolveManagedUserErrorMessage(userError.code);
    return acc;
  }, {});
  const users = currentUsers.users.map(user => ({ ...user, error: errors[user.id] }));

  return {
    ...currentUsers,
    users
  };
};

const resolveManagedUserErrorMessage = code => {
  if (code === ERROR_CODES.MANAGE_USER_NOT_FOUND) {
    return 'wall.user.details.manage.error.userNotFound';
  }

  if (code === ERROR_CODES.MANAGE_USER_ALREADY_ASSIGNED) {
    return 'wall.user.details.manage.error.userAssigned';
  }

  return 'wall.user.details.manage.error.userInvalid';
};
