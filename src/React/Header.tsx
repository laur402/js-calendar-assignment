import React from 'react';
import { CLASSES, MONTHS } from '../constants';
import { getFirstDayOfWeek, getLastDayOfWeek } from '../helper-functions';
import { useAppDispatch } from './redux/hooks';
import {
    weekViewWeekOffsetDecrement,
    weekViewWeekOffsetIncrement,
    weekViewWeekOffsetSet,
} from './redux/weekViewWeekOffsetSlice';
import { sidebarCalendarMonthOffsetSet } from './redux/sidebarCalendarMonthOffsetSlice';
import { useWeekViewWeekOffsetDate } from './weekViewHelperFunctions';

export function Header() {
    const dispatch = useAppDispatch();
    const weekViewOffsetDate = useWeekViewWeekOffsetDate();
    return (
        <header className={CLASSES.Header}>
            <div className={CLASSES.Header_AppTitle}>
                <img src="/logo.svg" alt="Calendar Logo" height="32" />
                <h1>Calendar</h1>
            </div>
            <div className={CLASSES.Header_Buttons}>
                <button
                    className={`${CLASSES.Header_Buttons_Today} \
                ${CLASSES.Button_Backgroundless}`}
                    onClick={() => {
                        dispatch(weekViewWeekOffsetSet(0));
                        dispatch(sidebarCalendarMonthOffsetSet(0));
                    }}
                >
                    Today
                </button>
                <button
                    className={`${CLASSES.Header_Buttons_WeekLeft} \
                ${CLASSES.Button_Backgroundless} \
                ${CLASSES.Button_Borderless} \
                ${CLASSES.MaterialSymbolsOutlined}`}
                    onClick={() => {
                        dispatch(weekViewWeekOffsetDecrement());
                    }}
                >
                    chevron_left
                </button>
                <button
                    className={`${CLASSES.Header_Buttons_WeekRight} \
                ${CLASSES.Button_Backgroundless} \
                ${CLASSES.Button_Borderless} \
                ${CLASSES.MaterialSymbolsOutlined}`}
                    onClick={() => {
                        dispatch(weekViewWeekOffsetIncrement());
                    }}
                >
                    chevron_right
                </button>
            </div>
            <HeaderMonthYearDate weekViewOffset={weekViewOffsetDate} />
        </header>
    );
}
function HeaderMonthYearDate({ weekViewOffset }: { weekViewOffset: Date }) {
    return (
        <h2 className={CLASSES.Header_MonthYearDate}>
            {getHeaderDateLabel(weekViewOffset)}
        </h2>
    );
}

function getHeaderDateLabel(weekViewOffset: Date) {
    const firstDayOfWeek = getFirstDayOfWeek(weekViewOffset);
    const lastDayOfWeek = getLastDayOfWeek(weekViewOffset);
    if (firstDayOfWeek.getMonth() === lastDayOfWeek.getMonth()) {
        return `${firstDayOfWeek.getFullYear()} ${MONTHS[lastDayOfWeek.getMonth()]}`;
    } else if (firstDayOfWeek.getFullYear() === lastDayOfWeek.getFullYear()) {
        return `${firstDayOfWeek.getFullYear()} ${MONTHS[firstDayOfWeek.getMonth()]} - ${MONTHS[lastDayOfWeek.getMonth()]}`;
    } else
        return `${firstDayOfWeek.getFullYear()} ${MONTHS[firstDayOfWeek.getMonth()]} - ${lastDayOfWeek.getFullYear()} ${MONTHS[lastDayOfWeek.getMonth()]}`;
}
