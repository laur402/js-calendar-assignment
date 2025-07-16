import React from "react";
import {CLASSES, MONTHS} from "../constants";
import {getWeekViewWeekOffsetDate} from "./WeekView";
import {getFirstDayOfWeek, getLastDayOfWeek} from "../helper-functions";
import {useAppDispatch} from "./redux/hooks";
import {
    weekViewWeekOffsetDecrement,
    weekViewWeekOffsetIncrement,
    weekViewWeekOffsetSet
} from "./redux/weekViewWeekOffsetSlice";
import {sidebarCalendarMonthOffsetSet} from "./redux/sidebarCalendarMonthOffsetSlice";

export function Header() {
    const dispatch = useAppDispatch();
    return (
        <header className={CLASSES.Header}>
            <div className={CLASSES.Header_AppTitle}>
                <img src="/logo.svg" alt="Calendar Logo" height="32"/>
                <h1>Calendar</h1>
            </div>
            <div className={CLASSES.Header_Buttons}>
                <button className={`${CLASSES.Header_Buttons_Today} ${CLASSES.Button_Backgroundless}`}
                        onClick={async () => {
                            dispatch(weekViewWeekOffsetSet(0));
                            dispatch(sidebarCalendarMonthOffsetSet(0));
                }}>Today</button>
                <button className={`${CLASSES.Header_Buttons_WeekLeft} ${CLASSES.Button_Backgroundless} ${CLASSES.Button_Borderless} ${CLASSES.MaterialSymbolsOutlined}`}
                        onClick={async ()=>{
                            dispatch(weekViewWeekOffsetDecrement());
                        }}>
                    chevron_left
                </button>
                <button className={`${CLASSES.Header_Buttons_WeekRight} ${CLASSES.Button_Backgroundless} ${CLASSES.Button_Borderless} ${CLASSES.MaterialSymbolsOutlined}`}
                        onClick={async () => {
                            dispatch(weekViewWeekOffsetIncrement());
                        }}>
                    chevron_right
                </button>
            </div>
            <h2 className={CLASSES.Header_MonthYearDate}>{getHeaderDateLabel()}</h2>
        </header>
    );
}

function getHeaderDateLabel(){
    const firstDayOfWeek = getFirstDayOfWeek(getWeekViewWeekOffsetDate());
    const lastDayOfWeek = getLastDayOfWeek(getWeekViewWeekOffsetDate());
    if (firstDayOfWeek.getMonth() === lastDayOfWeek.getMonth()) {
        return `${firstDayOfWeek.getFullYear()} ${MONTHS[lastDayOfWeek.getMonth()]}`;
    }
    else if (firstDayOfWeek.getFullYear() === lastDayOfWeek.getFullYear()) {
        return `${firstDayOfWeek.getFullYear()} ${MONTHS[firstDayOfWeek.getMonth()]} - ${MONTHS[lastDayOfWeek.getMonth()]}`;
    }
    else return `${firstDayOfWeek.getFullYear()} ${MONTHS[firstDayOfWeek.getMonth()]} - ${lastDayOfWeek.getFullYear()} ${MONTHS[lastDayOfWeek.getMonth()]}`;
}