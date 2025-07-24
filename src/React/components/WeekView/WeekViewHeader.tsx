import { CLASSES, LOAD_TIME } from '../../../constants';
import { WeekViewHeaderDate } from './WeekViewHeaderDate';
import React from 'react';
import { getTimezone, leftPad } from '../../../helper-functions';
import { CalendarDatesPackage } from '../../WeekView';
import { STYLE_VARS } from '../../StyleVariables';
import { Text } from '../../elements/Text';

export function WeekViewHeader({
  headerDates,
}: {
  headerDates: CalendarDatesPackage[];
}) {
  const timezoneOffset = getTimezone(LOAD_TIME);
  const timezoneOffsetString = leftPad(timezoneOffset, 2);
  return (
    <header className={CLASSES.WeekView_DatesHeader} style={DateHeaderStyle}>
      <div className={'DatesHeaderElementContainer'}>
        <div
          className={CLASSES.WeekView_DatesHeader_DateContainer}
          style={DateContainerStyle}
        >
          <Text
            textSize={0.75}
            className={CLASSES.WeekView_DatesHeader_DateContainer_Timezone}
            style={TimezoneStyle}
          >
            UTC
            {`${timezoneOffset < 0 ? '-' : '+'}${timezoneOffsetString}`}
          </Text>
          {headerDates.map(value => (
            <WeekViewHeaderDate
              key={value.normalizedDate.getTime()}
              dayStr={value.weekdayLabel}
              dayNum={value.dateLabel}
              isToday={value.isToday}
            />
          ))}
        </div>
        <AllDayRow headerDates={headerDates} />
      </div>
      <div
        className={'Scroll gutter spacing fix'}
        style={{
          visibility: 'hidden',
          overflowY: 'scroll',
        }}
      ></div>
    </header>
  );
}
const DateHeaderStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr auto', // Scroll gutter spacing fix
};
const DateContainerStyle = {
  display: 'grid',
  gridTemplateColumns: `3rem ${STYLE_VARS.columnSize}`,
};
const TimezoneStyle = {
  alignSelf: 'end',
  borderBottom: STYLE_VARS.borderConfig,
  color: STYLE_VARS.colorGrayActive,
};

function AllDayRow({ headerDates }: { headerDates: CalendarDatesPackage[] }) {
  return (
    <div
      className={CLASSES.WeekView_DatesHeader_AllDayRow}
      style={AllDayRowStyle}
    >
      {headerDates.map(value => (
        <div
          key={value.normalizedDate.getTime()}
          className={CLASSES.WeekView_DatesHeader_AllDayRow_Cell}
          style={AllDayRowCellStyle}
        ></div>
      ))}
    </div>
  );
}
const AllDayRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  paddingLeft: '3rem',
  boxShadow: `${STYLE_VARS.colorGrayShadow} 0 0.2rem 0.2rem -0.2rem`,
};
const AllDayRowCellStyle = {
  height: `calc(${STYLE_VARS.cellSize} / 2)`,
  borderLeft: STYLE_VARS.borderConfig,
  /* border-bottom: 1px solid deeppink; */
};
