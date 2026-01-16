import React, { memo } from 'react';

import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/widgets/AgendaWidget.module.scss';

/**
 * Molecule component used to render agenda widget slide
 *
 * @param date
 * @param locale
 * @param className
 * @constructor
 */
const AgendaWidgetSlide = ({ date, locale, className = '' }) => {
  const { agendaWidgetSlide, agendaWidgetSlideDayDate, agendaWidgetSlideText } = style;
  const { colorTitle } = useSelectedProgramDesign();

  if (!date) {
    return null;
  }

  return (
    <div>
      <div className={`${agendaWidgetSlide} ${className}`}>
        <div className={agendaWidgetSlideDayDate} style={{ color: colorTitle }}>
          {date.getDate()}
        </div>
        <div className={agendaWidgetSlideText}>
          <p>{date.toLocaleDateString(locale, { month: 'long' })}</p>
          <p>{date.toLocaleDateString(locale, { weekday: 'long' })}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(AgendaWidgetSlide);
