import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';

/**
 * Hook to manage sidebar collapsed state
 * Persists state to localStorage
 * Supports hover-to-expand behavior
 */
export const useSidebarCollapse = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });
  
  // Track if sidebar is temporarily expanded via hover
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
    setIsHoverExpanded(false);
  }, []);

  const expandSidebar = useCallback(() => {
    setIsCollapsed(false);
    setIsHoverExpanded(false);
  }, []);

  const collapseSidebar = useCallback(() => {
    setIsCollapsed(true);
    setIsHoverExpanded(false);
  }, []);

  // Hover handlers for temporary expansion
  const handleMouseEnter = useCallback(() => {
    if (isCollapsed) {
      setIsHoverExpanded(true);
    }
  }, [isCollapsed]);

  const handleMouseLeave = useCallback(() => {
    setIsHoverExpanded(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  // Visual state: collapsed only if truly collapsed AND not hover-expanded
  const isVisuallyCollapsed = isCollapsed && !isHoverExpanded;

  return {
    isCollapsed,
    isVisuallyCollapsed,
    isHoverExpanded,
    toggleCollapse,
    expandSidebar,
    collapseSidebar,
    handleMouseEnter,
    handleMouseLeave
  };
};

export default useSidebarCollapse;
