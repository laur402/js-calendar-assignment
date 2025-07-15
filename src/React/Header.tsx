import React from "react";
import {SidebarCalendarMonthOffsetContext, useStateContext, WeekViewWeekOffsetContext} from "./contexts";
import {CLASSES, MONTHS} from "../constants";
import {getWeekViewWeekOffsetDate} from "./WeekView";
import {getFirstDayOfWeek, getLastDayOfWeek} from "../helper-functions";

export function Header() {
    const weekOffsetState = useStateContext(WeekViewWeekOffsetContext);
    const monthOffsetState = useStateContext(SidebarCalendarMonthOffsetContext);
    return (
        <header className={CLASSES.Header}>
            <div className={CLASSES.Header_AppTitle}>
                <img src="/logo.svg" alt="Calendar Logo" height="32"/>
                <h1>Calendar</h1>
            </div>
            <div className={CLASSES.Header_Buttons}>
                <button className={`${CLASSES.Header_Buttons_Today} ${CLASSES.Button_Backgroundless}`}
                        onClick={async () => {
                            weekOffsetState?.setValue(0);
                            monthOffsetState?.setValue(0);
                }}>Today</button>
                <button className={`${CLASSES.Header_Buttons_WeekLeft} ${CLASSES.Button_Backgroundless} ${CLASSES.Button_Borderless} ${CLASSES.MaterialSymbolsOutlined}`}
                        onClick={async ()=>{
                            weekOffsetState?.setValue(weekOffsetState?.value - 1);
                        }}>
                    chevron_left
                </button>
                <button className={`${CLASSES.Header_Buttons_WeekRight} ${CLASSES.Button_Backgroundless} ${CLASSES.Button_Borderless} ${CLASSES.MaterialSymbolsOutlined}`}
                        onClick={async () => {
                            weekOffsetState?.setValue(weekOffsetState?.value + 1);
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