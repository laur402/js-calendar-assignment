import React from "react";
import {CLASSES} from "../../constants";

export function WeekViewHeaderDate({dayStr, dayNum, isToday}:{dayStr: string, dayNum: number, isToday: boolean}) {
    return (
        <div className={`${CLASSES.WeekView_DatesHeader_DateContainer_Date} ${isToday ? CLASSES.WeekView_DatesHeader_DateContainer_Date_Active : ""}`}>
            <div className={CLASSES.WeekView_DatesHeader_DateContainer_Date_Weekday}>{dayStr}</div>
            <div className={CLASSES.WeekView_DatesHeader_DateContainer_Date_Day}>{dayNum}</div>
        </div>
    );
}