import React from "react";
import {addHours, leftPad, toISOLocaleString} from "../../helper-functions";
import {CLASSES} from "../../constants";
import {useAppDispatch} from "../redux/hooks";
import {modalStateShow} from "../redux/modalStateSlice";
import {modalInputModify} from "../redux/modalInputSlice";

export function CalendarGridColumn({hoursInADay, associatedDate}:{hoursInADay: number, associatedDate: Date}){
    return (
        <div className={CLASSES.WeekView_CalendarGrid_CalendarColumn}>
            {[...Array(hoursInADay).keys()].map(
                (hour)=><CalendarGridColumnCell key={hour+1} associatedDate={addHours(associatedDate, hour)}/>
            )}
        </div>
    );
}
export function CalendarGridTimeColumn({hoursInADay}:{hoursInADay: number}) {
    return (
        <div className={CLASSES.WeekView_CalendarGrid_TimeColumn}>
            {[...Array(hoursInADay).keys()].map(
            (hour: number)=><div key={hour+1} className={CLASSES.WeekView_CalendarGrid_TimeColumn_Cell}>
                {hour+1 === hoursInADay ? "" : `${leftPad(hour+1, 2)}:00`}
            </div>
            )}
        </div>
    );
}

function CalendarGridColumnCell({associatedDate}:{associatedDate: Date}) {
    const dispatch = useAppDispatch();
    return (
        <div className={CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell}>
            <button className={CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell_Button}
                    onClick={()=>{
                        dispatch(modalStateShow());
                        dispatch((modalInputModify({
                            modalEventID: "",
                            modalEventName: "",
                            modalEventStart: toISOLocaleString(associatedDate),
                            modalEventEnd: toISOLocaleString(addHours(associatedDate, 1)),
                            modalEventDescription: "",
                            isModalEventExisting: false
                        })))
                    }}></button>
        </div>
    );
}