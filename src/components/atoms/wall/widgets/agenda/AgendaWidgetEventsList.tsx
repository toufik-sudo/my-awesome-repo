import React from 'react';

import AgendaWidgetEvent from 'components/atoms/wall/widgets/agenda/AgendaWidgetEvent';

import style from 'sass-boilerplate/stylesheets/components/wall/widgets/AgendaWidget.module.scss';

/**
 * Molecule component used to render agenda widget events list
 *
 * @constructor
 */
const AgendaWidgetEventsList = ({ isShowMoreActive, hasMore, tasks = [] }) => {
  const { agendaWidgetEventList, agendaWidgetEventListInactive, agendaWidgetEventListHidden, hasMoreItems } = style;
  const isExtendedListInactive = !isShowMoreActive || !hasMore;

  return (
    <div
      className={`${agendaWidgetEventList} ${tasks.length === 0 ? agendaWidgetEventListHidden : ''}  ${
        isExtendedListInactive ? agendaWidgetEventListInactive : ''
      } ${hasMore ? hasMoreItems : ''}`}
    >
      {tasks.slice(0, isExtendedListInactive ? 4 : undefined).map(({ id, title: name, time }) => (
        <AgendaWidgetEvent {...{ name, time }} key={id} />
      ))}
    </div>
  );
};

export default AgendaWidgetEventsList;
