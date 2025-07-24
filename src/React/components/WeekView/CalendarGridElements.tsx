import React from 'react';
import {
  addHours,
  leftPad,
  toISOLocaleString,
} from '../../../helper-functions';
import { CLASSES } from '../../../constants';
import { useAppDispatch } from '../../redux/hooks';
import { modalStateShow } from '../../redux/modalStateSlice';
import { modalInputModify } from '../../redux/modalInputSlice';
import { CalendarDatesPackage } from '../../WeekView';
import { STYLE_VARS } from '../../StyleVariables';

export function CalendarGrid({
  headerDates,
  hoursInADay,
}: {
  headerDates: CalendarDatesPackage[];
  hoursInADay: number;
}) {
  return (
    <section
      className={CLASSES.WeekView_CalendarGrid}
      style={CalendarGridStyle}
    >
      <CalendarGridTimeColumn hoursInADay={hoursInADay} />
      {headerDates.map(dateValue => (
        <CalendarGridColumn
          key={dateValue.normalizedDate.getTime()}
          hoursInADay={hoursInADay}
          associatedDate={dateValue.normalizedDate}
        />
      ))}
    </section>
  );
}
const CalendarGridStyle = {
  gridColumn: '1 / span 2',
  gridRow: 1,

  display: 'grid',
  gridTemplateColumns: `3rem ${STYLE_VARS.columnSize}`,
  gridAutoFlow: 'column',
  /*overflowY: auto;*/
};

function CalendarGridColumn({
  hoursInADay,
  associatedDate,
}: {
  hoursInADay: number;
  associatedDate: Date;
}) {
  return (
    <div className={CLASSES.WeekView_CalendarGrid_CalendarColumn}>
      {[...Array(hoursInADay).keys()].map(hour => (
        <CalendarGridColumnCell
          key={hour + 1}
          associatedDate={addHours(associatedDate, hour)}
        />
      ))}
    </div>
  );
}
function CalendarGridTimeColumn({ hoursInADay }: { hoursInADay: number }) {
  return (
    <div
      className={CLASSES.WeekView_CalendarGrid_TimeColumn}
      style={TimeColumnStyle}
    >
      {[...Array(hoursInADay).keys()].map((hour: number) => (
        <div
          key={hour + 1}
          className={CLASSES.WeekView_CalendarGrid_TimeColumn_Cell}
          style={TimeColumnCellStyle}
        >
          {hour + 1 === hoursInADay ? '' : `${leftPad(hour + 1, 2)}:00`}
        </div>
      ))}
    </div>
  );
}
const TimeColumnCellStyle = {
  display: 'grid',
  height: STYLE_VARS.cellSize,
  borderBottom: STYLE_VARS.borderConfig,
  fontSize: '0.75em',
  alignItems: 'end',
  color: STYLE_VARS.colorGray,
};
const TimeColumnStyle = {
  display: 'grid',
  gridTemplateRows: `repeat(23, ${STYLE_VARS.cellSize})`,
  gridAutoFlow: 'row',
};

function CalendarGridColumnCell({ associatedDate }: { associatedDate: Date }) {
  const dispatch = useAppDispatch();
  return (
    <div
      className={CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell}
      style={CalendarCellStyle}
    >
      <button
        className={CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell_Button}
        style={CalendarCellButtonStyle}
        onClick={() => {
          dispatch(modalStateShow());
          dispatch(
            modalInputModify({
              modalEventID: '',
              modalEventName: '',
              modalEventStart: toISOLocaleString(associatedDate),
              modalEventEnd: toISOLocaleString(addHours(associatedDate, 1)),
              modalEventDescription: '',
              isModalEventExisting: false,
            }),
          );
        }}
      ></button>
    </div>
  );
}

const CalendarCellButtonStyle = {
  flex: 1,
  background: 'transparent',
  border: 'none',
};
const CalendarCellStyle = {
  borderLeft: STYLE_VARS.borderConfig,
  borderBottom: STYLE_VARS.borderConfig,
  height: STYLE_VARS.cellSize,

  display: 'grid',
};
