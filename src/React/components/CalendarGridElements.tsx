import React from "react";
import {leftPad} from "../../helper-functions";
import {CLASSES} from "../../constants";

export function CalendarGridColumn({hoursInADay}:{hoursInADay: number}){
    return (
        <div className={CLASSES.WeekView_CalendarGrid_CalendarColumn}>
            {[...Array(hoursInADay).keys()].map(
            ()=><CalendarGridColumnCell />
            )}
        </div>
    );
}
export function CalendarGridTimeColumn({hoursInADay}:{hoursInADay: number}) {
    return (
        <div className={CLASSES.WeekView_CalendarGrid_TimeColumn}>
            {[...Array(hoursInADay).keys()].map(
            (hour: number)=><div className={CLASSES.WeekView_CalendarGrid_TimeColumn_Cell}>
                {hour+1 === hoursInADay ? "" : `${leftPad(hour+1, 2)}:00`}
            </div>
            )}
        </div>
    );
}

function CalendarGridColumnCell() {
    return (
        <div className={CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell}>
            <button className={CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell_Button}></button>
        </div>
    );
}