import React from 'react';

import PostDatePicker from 'components/atoms/wall/PostDatePicker';
import { TASK } from 'constants/wall/posts';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';

/**
 * Molecule component used to render datepicker for post
 */
const PostDateSelector = ({ postDate: { startDate, endDate, hasError, touched }, setPostDate, postType }) => {
  const { wallPostActionBlock, taskDatePicker, taskDatePickerInput } = style;

  let datePicker = (
    <PostDatePicker
      selectedDate={startDate}
      onDateChange={date => setPostDate({ startDate: date })}
      hasError={hasError}
    />
  );

  if (postType === TASK) {
    datePicker = (
      <>
        <div className={taskDatePicker}>
          <PostDatePicker
            selectedDate={startDate}
            label="wall.posts.date.start"
            onDateChange={date => setPostDate({ startDate: date, endDate })}
            selectsStart
            {...{ startDate, endDate, hasError, touched }}
            customClass={taskDatePickerInput}
          />
        </div>
        <PostDatePicker
          minDate={startDate || new Date()}
          selectedDate={endDate}
          label="wall.posts.date.end"
          onDateChange={date => setPostDate({ startDate, endDate: date })}
          selectsEnd
          customClass={taskDatePickerInput}
          {...{ startDate, endDate, hasError, touched }}
        />
      </>
    );
  }

  return <div className={`${wallPostActionBlock}`}>{datePicker}</div>;
};

export default PostDateSelector;
