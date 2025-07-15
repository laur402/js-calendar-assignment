import React from "react";
import {SidebarCalendarMonthOffsetContext, useStateContext, WeekViewWeekOffsetContext} from "./contexts";
import {CLASSES} from "../constants";

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
                <button className={`${CLASSES.Header_Buttons_WeekLeft} ${CLASSES.Button_Backgroundless} ${CLASSES.Button_Borderless} material-symbols-outlined`}
                        onClick={async ()=>{
                            weekOffsetState?.setValue(weekOffsetState?.value - 1);
                        }}>
                    chevron_left
                </button>
                <button className={`${CLASSES.Header_Buttons_WeekRight} ${CLASSES.Button_Backgroundless} ${CLASSES.Button_Borderless} material-symbols-outlined`}
                        onClick={async () => {
                            weekOffsetState?.setValue(weekOffsetState?.value + 1);
                        }}>
                    chevron_right
                </button>
            </div>
            <h2 className={CLASSES.Header_MonthYearDate}>Month Year</h2>
        </header>
    );
}