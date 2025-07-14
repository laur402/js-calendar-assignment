import React from "react";
import {useEffect, useState} from "react";
import {getNormalizedLocalDate} from "../../helper-functions";
import {CLASSES, TIME_IN_A_DAY_MS, TIME_IN_A_MINUTE_MS} from "../../constants";

export function CurrentTimeGraphic({currentTimeGraphicColumn}:{currentTimeGraphicColumn: number}) {
    const [currentTimeGraphicTop, setCurrentTimeGraphicTop] = useState(getCurrentTimePercentage());
    useEffect(() => {
        const timer = setInterval(()=>{
            setCurrentTimeGraphicTop(getCurrentTimePercentage());
        }, TIME_IN_A_MINUTE_MS);
        return () => clearInterval(timer);
    });
    return (
        <div className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic}
             style={{position: "absolute", top: `${currentTimeGraphicTop}%`, gridColumn: `${currentTimeGraphicColumn+1} / span 1`}}>
            <div className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Line} />
            <div className={CLASSES.WeekView_CalendarEventOverlay_CurrentTimeGraphic_Bauble}
                 style={{position: "absolute"}} />
        </div>
    )
}
function getCurrentTimePercentage(){
    const timeOfDay: number = new Date().getTime() - getNormalizedLocalDate(new Date()).getTime(); //ms from start of day
    return timeOfDay / TIME_IN_A_DAY_MS * 100;
}