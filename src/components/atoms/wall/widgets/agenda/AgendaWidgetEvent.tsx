import React from 'react';

import style from 'sass-boilerplate/stylesheets/components/wall/widgets/AgendaWidget.module.scss';

/**
 * Atom component used to render agenda widget
 *
 * @param time
 * @param name
 * @constructor
 */
const AgendaWidgetEvent = ({ time, name }) => {
  const { agendaWidgetEventItem, agendaWidgetEventItemName, Item } = style;

  return (
    <div className={`${agendaWidgetEventItem} ${Item}`}>
      <div>{time}</div>
      <div className={agendaWidgetEventItemName}>{name}</div>
    </div>
  );
};

export default AgendaWidgetEvent;
