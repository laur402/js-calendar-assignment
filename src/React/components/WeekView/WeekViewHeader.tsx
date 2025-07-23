import { CLASSES, LOAD_TIME } from '../../../constants';
import { WeekViewHeaderDate } from './WeekViewHeaderDate';
import React from 'react';
import { getTimezone, leftPad } from '../../../helper-functions';
import { CalendarDatesPackage } from '../../WeekView';

export function WeekViewHeader({
  headerDates,
}: {
  headerDates: CalendarDatesPackage[];
}) {
  const timezoneOffset = getTimezone(LOAD_TIME);
  const timezoneOffsetString = leftPad(timezoneOffset, 2);
  return (
    <header className={CLASSES.WeekView_DatesHeader}>
      <div className={CLASSES.WeekView_DatesHeader_DateContainer}>
        <div className={CLASSES.WeekView_DatesHeader_DateContainer_Timezone}>
          UTC
          {`${timezoneOffset < 0 ? '-' : '+'}${timezoneOffsetString}`}
        </div>
        {headerDates.map(value => (
          <WeekViewHeaderDate
            key={value.normalizedDate.getTime()}
            dayStr={value.weekdayLabel}
            dayNum={value.dateLabel}
            isToday={value.isToday}
          />
        ))}
      </div>
      <div className={CLASSES.WeekView_DatesHeader_AllDayRow}>
        {headerDates.map(value => (
          <div
            key={value.normalizedDate.getTime()}
            className={CLASSES.WeekView_DatesHeader_AllDayRow_Cell}
          ></div>
        ))}
      </div>
    </header>
  );
}
