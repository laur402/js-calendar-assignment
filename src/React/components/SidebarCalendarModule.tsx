import React from "react";
import {CLASSES, getWeekdaysByLocale, LOAD_TIME} from "../../constants";
import {SidebarCalendarMonthOffsetContext, useStateContext, WeekViewWeekOffsetContext} from "../contexts";
import {
    addDays,
    cycleArray,
    getFirstDayOfMonth,
    getFirstDayOfWeek,
    getLastDayOfMonth,
    getLastDayOfWeek, getWeekDifference, isSameMonth, toYearMonthString
} from "../../helper-functions";

export function SidebarCalendarModule(){
    const monthOffsetState = useStateContext(SidebarCalendarMonthOffsetContext);
    const monthOffsetDate = getSidebarCalendarMonthOffsetDate();
    const firstDay: Date = getFirstDayOfMonth(new Date(monthOffsetDate));
    const lastDay: Date = getLastDayOfMonth(new Date(monthOffsetDate));
    return (
        <div className={CLASSES.Aside_CalendarModule}>
            <div className={CLASSES.CalendarModule_Header}>
                <div className={CLASSES.CalendarModule_Header_Date}>
                    {toYearMonthString(monthOffsetDate)}
                </div>
                <div className={CLASSES.CalendarModule_Header_Buttons}>
                    <button
                        className={`${CLASSES.CalendarModule_Header_Buttons_Left} \
                        ${CLASSES.Button_Backgroundless} \
                        ${CLASSES.Button_Borderless} \
                        ${CLASSES.MaterialSymbolsOutlined}`}
                        onClick={()=>{
                            monthOffsetState.setValue((prevValue)=>prevValue - 1);
                        }}>
                        chevron_left
                    </button>
                    <button
                        className={`${CLASSES.CalendarModule_Header_Buttons_Right} \
                        ${CLASSES.Button_Backgroundless} \
                        ${CLASSES.Button_Borderless} \
                        ${CLASSES.MaterialSymbolsOutlined}`}
                        onClick={()=>{
                            monthOffsetState.setValue((prevValue)=>prevValue + 1);
                        }}>
                        chevron_right
                    </button>
                </div>
            </div>
            {cycleArray(getWeekdaysByLocale("narrow"), -1).map((weekday, index)=>{
                return <div key={index} className={CLASSES.CalendarModule_WeekDayRowCell}>
                    {weekday}
                </div>
            })}
            {[...Array(getWeekDifference(firstDay, lastDay)+1).keys()].map((weekOfMonth)=>{
                const offsetDate = addDays(new Date(firstDay), 7*weekOfMonth);
                const firstDayOfWeek = getFirstDayOfWeek(offsetDate);
                return [...Array(7).keys()].map((weekDay)=>{
                    const buttonDate = addDays(new Date(firstDayOfWeek), weekDay);
                    return <SidebarCalendarLabelButton key={buttonDate.getTime()}
                        date={buttonDate}
                        weekOffset={getWeekDifference(LOAD_TIME, buttonDate)}
                        isCurrentMonth={isSameMonth(firstDay, buttonDate)} />;
                })
            })}
        </div>
    );
}

function SidebarCalendarLabelButton({date, weekOffset, isCurrentMonth}:{date: Date, weekOffset: number, isCurrentMonth: boolean}) {
    const weekViewWeekOffsetState = useStateContext(WeekViewWeekOffsetContext);

    return (
        <button
            className={`${CLASSES.CalendarModule_DayCell} \
            ${CLASSES.Button_Backgroundless} \
            ${CLASSES.Button_Borderless} \
            ${isCurrentMonth ? "" : CLASSES.CalendarModule_DayCell_NotCurrent}`}
            onClick={() => {
                weekViewWeekOffsetState?.setValue(weekOffset);
            }}>
            {date.getDate()}
        </button>
    );
}

function getSidebarCalendarMonthOffsetDate(){
    const currentMonth = new Date(LOAD_TIME);
    currentMonth.setMonth(currentMonth.getMonth() + getSidebarCalendarMonthOffset())
    return currentMonth;
}
function getSidebarCalendarMonthOffset(){
    const monthOffsetState = useStateContext(SidebarCalendarMonthOffsetContext);
    return monthOffsetState?.value;
}