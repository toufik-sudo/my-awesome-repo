import React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ReactTooltip from 'react-tooltip';
import { useIntl } from 'react-intl';
import { TOOLTIP_FIELDS } from 'constants/tootltip';

import style from 'assets/style/components/wall/SidebarCollapseToggle.module.scss';
import toggleRightImg from 'assets/images/icones/toggle_right.png';

interface SidebarCollapseToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Toggle button to collapse/expand sidebar
 */
const SidebarCollapseToggle: React.FC<SidebarCollapseToggleProps> = ({ isCollapsed, onToggle, isHoverExpanded }) => {
  const { formatMessage } = useIntl();
  const tooltipText = isCollapsed
    ? formatMessage({ id: 'sidebar.expand', defaultMessage: 'Expand sidebar' })
    : formatMessage({ id: 'sidebar.collapse', defaultMessage: 'Collapse sidebar' });

  return (
    <>
      <button
        className={(isCollapsed && !isHoverExpanded) ? style.toggleRightCollapsed : style.toggleRight}
        style={{ background: 'none', border: 'none' }}
        onClick={onToggle}
        data-tip={tooltipText}
        data-for="sidebar-toggle-tooltip"
        aria-label={tooltipText}
      >
        {(isCollapsed && !isHoverExpanded) ? (
          <img src={toggleRightImg} alt={tooltipText} />
        ) : (
          <img src={toggleRightImg} alt={tooltipText} />
        )}
        {/* {isCollapsed ? (
          <PanelLeftOpen size={16} strokeWidth={2} />
        ) : (
          <PanelLeftClose size={16} strokeWidth={2} />
        )} */}
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
