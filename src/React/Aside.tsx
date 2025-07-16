import React from "react";
import {ModalInputContext, ModalStateContext, useStateContext} from "./contexts";
import {addHours, toISOLocaleString} from "../helper-functions";
import {LOAD_TIME} from "../constants";
import {SidebarCalendarModule} from "./components/SidebarCalendarModule";

export function Aside() {
    const modalState = useStateContext(ModalStateContext);
    const modalInputState = useStateContext(ModalInputContext);
    return (
        <aside className="aside">
            <button className="create-event-button new-event-modal-caller"
                    onClick={()=>{
                        modalState?.setValue(true);
                        modalInputState?.setValue({
                            modalEventID: "",
                            modalEventName: "",
                            modalEventStart: toISOLocaleString(new Date()),
                            modalEventEnd: toISOLocaleString(addHours(new Date(), 1)),
                            modalEventDescription: "",
                            isModalEventExisting: false
                        })
            }}><span
                className="material-symbols-outlined">add</span><span>Create Event</span></button>
            <SidebarCalendarModule />
        </aside>
    )
}