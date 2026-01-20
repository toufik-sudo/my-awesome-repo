import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ReactTooltip from 'react-tooltip';
import { useIntl } from 'react-intl';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import style from 'assets/style/components/wall/SidebarCollapseToggle.module.scss';

interface SidebarCollapseToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Toggle button to collapse/expand sidebar
 */
const SidebarCollapseToggle: React.FC<SidebarCollapseToggleProps> = ({ isCollapsed, onToggle }) => {
  const { formatMessage } = useIntl();
  const tooltipText = isCollapsed 
    ? formatMessage({ id: 'sidebar.expand', defaultMessage: 'Expand sidebar' })
    : formatMessage({ id: 'sidebar.collapse', defaultMessage: 'Collapse sidebar' });

  return (
    <>
      <button
        className={`${style.collapseToggle} ${isCollapsed ? style.collapsed : ''}`}
        onClick={onToggle}
        data-tip={tooltipText}
        data-for="sidebar-toggle-tooltip"
        aria-label={tooltipText}
      >
        {isCollapsed ? (
          <PanelLeftOpen size={16} strokeWidth={2} />
        ) : (
          <PanelLeftClose size={16} strokeWidth={2} />
        )}
      </button>
      <ReactTooltip
        id="sidebar-toggle-tooltip"
        place={TOOLTIP_FIELDS.PLACE_RIGHT}
        effect={TOOLTIP_FIELDS.EFFECT_SOLID}
        className="nav-tooltip"
        delayShow={300}
      />
    </>
  );
};

export default SidebarCollapseToggle;
