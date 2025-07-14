import React from "react";
import {CalendarGridColumn, CalendarGridTimeColumn} from "./components/CalendarGridElements";
import {WeekViewHeaderDate} from "./components/WeekViewHeaderDate";
import {addDays, getFirstDayOfWeek, getTimezone, isSameDay, leftPad} from "../helper-functions";
import {CLASSES, LOAD_TIME, THREE_LETTER_WEEK_DAYS, TIME_IN_A_WEEK_MS} from "../constants";
import {CurrentTimeGraphic} from "./components/CurrentTimeGraphic";

export function WeekView() {
    const timezoneOffset = getTimezone(LOAD_TIME);
    const timezoneOffsetString = leftPad(timezoneOffset, 2);
    const hoursInADay = 24;
    const headerDates = getCalendarDateLabels(getOffsetDate());
    return (
        <section className={CLASSES.WeekViewContainer}>
            <header className={CLASSES.WeekView_DatesHeader}>
                <div className={CLASSES.WeekView_DatesHeader_DateContainer}>
                    <div className={CLASSES.WeekView_DatesHeader_DateContainer_Timezone}>
                        UTC{`${timezoneOffset < 0 ? "-" : "+"}${timezoneOffsetString}`}
                    </div>
                    {headerDates.map((value) =>
                        <WeekViewHeaderDate dayStr={value.weekdayLabel} dayNum={value.dateLabel} isToday={value.isToday}/>
                    )}
                </div>
                <div className={CLASSES.WeekView_DatesHeader_AllDayRow}>
                    {[...Array(7).keys()].map(
                        ()=><div className={CLASSES.WeekView_DatesHeader_AllDayRow_Cell}></div>
                    )}
                </div>
            </header>
            <section className={CLASSES.WeekView_CalendarContainer}>
                <div className={CLASSES.WeekView_CalendarEventOverlay}>
                    {headerDates.map((value, index)=>{
                        if (value.isToday)
                            return <CurrentTimeGraphic currentTimeGraphicColumn={index} />
                        else return null
                    })}
                    {/*<EventElement calendarEvent={} elementStyles = {
                        position: "absolute",
                        gridColumn: `${eventGridColumn} / span 1`,
                        top: eventBoxTop + "px",
                        width: `${width}%`,
                        left: `${100 - width}%`,
                        height: eventBoxBottom - eventBoxTop + "px",
                        minHeight: calendarCellHeight/4 + "px",
                        //if (isThinHeightVersion) {
                        //    eventBox.style.gridTemplateColumns = "1fr 1fr";
                        //    eventBox.style.columnGap = "0.2rem";
                        //}
                        //else eventBox.style.gridTemplateRows = "1fr auto";
                        }
                        isThinHeightVersion: height < calendarCellHeight / 1.75;
                        isThinWidthVersion: width <= 50; */
                    }
                </div>
                <section className={CLASSES.WeekView_CalendarGrid}>
                    <CalendarGridTimeColumn hoursInADay={hoursInADay} />
                    {[...Array(7).keys()].map(
                        ()=> <CalendarGridColumn hoursInADay={hoursInADay} />
                    )}
                </section>
            </section>
        </section>
    );
}
function getOffsetDate(){
    return new Date(LOAD_TIME.getTime() + getWeekOffset() * TIME_IN_A_WEEK_MS);
}
function getWeekOffset() {
    return 0; //TODO: Replace with state logic, move towards root
}
function getCalendarDateLabels(offsetDate: Date) {
    return [...Array(7).keys()].map(value => {
        const weekDate = addDays(getFirstDayOfWeek(offsetDate), value);
        return {
            weekdayLabel: THREE_LETTER_WEEK_DAYS[weekDate.getDay()],
            dateLabel: weekDate.getDate(),
            isToday: isSameDay(weekDate, LOAD_TIME)
        }
    })
}