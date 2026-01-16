import React from 'react';
import Slider from 'react-slick';
import { useSelector } from 'react-redux';

import AgendaWidgetSlide from 'components/atoms/wall/widgets/agenda/AgendaWidgetSlide';
import useCalendarSlider from 'hooks/wall/useCalendarSlider';
import { IStore } from 'interfaces/store/IStore';
import { wallWidgetSliderSettings } from 'constants/slider';

import style from 'sass-boilerplate/stylesheets/components/wall/widgets/AgendaWidget.module.scss';

/**
 * Molecule component used to render agenda widget date slider
 *
 * @param initialDate
 * @param minDate
 * @param onDateChange
 * @param className
 *
 * @constructor
 */

const AgendaWidgetSlider = ({ initialDate, minDate, onDateChange, className = '' }) => {
  const { selectedLanguage } = useSelector((store: IStore) => store.languageReducer);
  const { selectedIndex, days, beforeDateChange } = useCalendarSlider(initialDate, new Date(minDate), onDateChange);

  return (
    <Slider
      key={`calendar_${days[selectedIndex]}`}
      initialSlide={selectedIndex}
      {...wallWidgetSliderSettings}
      infinite={false}
      className={style.pricingSlider}
      beforeChange={beforeDateChange}
    >
      {days.map(date => (
        <AgendaWidgetSlide
          key={`dateDisplay_${date}`}
          className={className}
          date={date}
          locale={selectedLanguage.value}
        />
      ))}
    </Slider>
  );
};

export default AgendaWidgetSlider;
