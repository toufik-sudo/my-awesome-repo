import React, { memo, useContext } from 'react';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import AgendaWidgetSlider from 'components/atoms/wall/widgets/agenda/AgendaWidgetSlider';
import AgendaWidgetEventsList from 'components/atoms/wall/widgets/agenda/AgendaWidgetEventsList';
import useAgendaLoader from 'hooks/wall/useAgendaLoader';
import useToggler from 'hooks/general/useToggler';
import { UserContext } from 'components/App';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { AGENDA_MAX_TASKS_NO_TOGGLE } from 'constants/wall/posts';
import { emptyFn } from 'utils/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/widgets/AgendaWidget.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import wallStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import widgetStyle from 'sass-boilerplate/stylesheets/components/wall/widgets/Widget.module.scss';
import Loading from '../../../atoms/ui/Loading';

/**
 * Organism component used to render agenda widget
 *
 * @constructor
 */
const AgendaWidget = () => {
  const { agendaWidget, agendaWidgetTitle, noTasks, agendaWidgetLink } = style;
  const { widgetTitle, widgetTextBody } = widgetStyle;
  const startDate = new Date();
  const { isActive: isShowMoreActive, toggle } = useToggler(false);
  const { userData = {} } = useContext(UserContext);
  const { currentTasks, onDateChange, isLoading } = useAgendaLoader(startDate);
  const taskCount = (currentTasks && Object.keys(currentTasks).length) || 0;
  const { colorMainButtons, colorWidgetTitle } = useSelectedProgramDesign();

  let showMore = true;
  let noTasksStyle = '';
  if (taskCount === 0) {
    noTasksStyle = noTasks;
  }

  if (taskCount <= AGENDA_MAX_TASKS_NO_TOGGLE) {
    showMore = false;
  }

  return (
    <GeneralBlock className={`${agendaWidget} ${coreStyle.textCenter} ${wallStyle.hideBlockMobile}`}>
      <DynamicFormattedMessage
        className={`${agendaWidgetTitle} ${widgetTitle}`}
        style={{ color: colorWidgetTitle }}
        id="wall.agendaWidget.title"
        tag={HTML_TAGS.SPAN}
      />
      <AgendaWidgetSlider
        className={noTasksStyle}
        {...{ minDate: userData.createdAt, onDateChange, initialDate: startDate }}
      />
      {isLoading && <Loading type={LOADER_TYPE.DROPZONE} />}
      {!isLoading && <AgendaWidgetEventsList {...{ isShowMoreActive, hasMore: showMore, tasks: currentTasks }} />}
      <div className={`${agendaWidgetLink} ${noTasksStyle} ${widgetTextBody} ${coreStyle.minHeight2}`}>
        {showMore && (
          <DynamicFormattedMessage
            onClick={showMore ? toggle : emptyFn}
            tag={HTML_TAGS.P}
            style={{ color: colorMainButtons }}
            id={`wall.agendaWidget.${isShowMoreActive ? 'hide' : 'see'}.all`}
          />
        )}
      </div>
    </GeneralBlock>
  );
};

export default memo(AgendaWidget);
