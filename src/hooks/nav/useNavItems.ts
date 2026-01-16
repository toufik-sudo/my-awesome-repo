import { useState, useEffect } from 'react';
import { getMenuItems, getWidgetsMenuItems, getExpandedMenuItemsForSuperUsers } from 'services/wall/navigation';
import { useSuperUsersMainRoutes } from './useSuperUsersMainRoutes';
import { useUserRole } from 'hooks/user/useUserRole';
import { hasAtLeastSuperRole } from 'services/security/accessServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';

export const useNavItems = () => {
  const isSuperUserMainRoute = useSuperUsersMainRoutes();
  const [menuItems, setMenuItems] = useState({ wall: [], widgets: [] });
  const { selectedPlatform } = useWallSelection();
  const userRole = useUserRole();

  useEffect(() => {
    const expandMenu = hasAtLeastSuperRole(userRole) && !isSuperUserMainRoute;
    setMenuItems({
      wall: getMenuItems(userRole, selectedPlatform),        
      widgets: getWidgetsMenuItems(userRole)
    });
  }, [userRole, isSuperUserMainRoute, selectedPlatform.hierarchicType, selectedPlatform]);

  return menuItems;
};
