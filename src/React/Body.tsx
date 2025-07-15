import React, {createContext, ReactNode, useContext, useState} from "react";
import "../../week-view-layout.css";
import {EventFormModal} from "./EventFormModal";
import {Header} from "./Header";
import {Aside} from "./Aside";
import {WeekView} from "./WeekView";
import {
    EventListContext,
    ModalInputContext,
    ModalStateContext,
    SidebarCalendarMonthOffsetContext,
    StateContext,
    WeekViewWeekOffsetContext
} from "./contexts";
import {CalendarEvent} from "../event-storage";

export function Body(){
    return (
        <Contexts>
            <EventFormModal />
            <Header />
            <main>
                <Aside />
                <WeekView />
            </main>
        </Contexts>
    );
}

function Contexts({children}:{children: ReactNode}){
    const [isModalActive, setIsModalActive] = useState(false);
    const modalContext: StateContext<boolean> = {
        value: isModalActive,
        setValue: setIsModalActive
    };
    const [weekViewWeekOffset, setWeekViewWeekOffset] = useState(0);
    const weekOffsetContext: StateContext<number> = {
        value: weekViewWeekOffset,
        setValue: setWeekViewWeekOffset
    };
    const [sidebarViewMonthOffset, setSidebarViewMonthOffset] = useState(0);
    const monthOffsetContext: StateContext<number> = {
        value: sidebarViewMonthOffset,
        setValue: setSidebarViewMonthOffset
    };
    const [modalInput, setModalInput] = useState<ModalInput>({
        modalEventID: "",
        modalEventName: "",
        modalEventStart: "",
        modalEventEnd: "",
        modalEventDescription: "",
        isModalEventExisting: false
    });
    const modalInputContext: StateContext<ModalInput> = {
        value: modalInput,
        setValue: setModalInput
    }
    const [eventsList, setEventsList] = useState<CalendarEvent[]>([]);
    const eventListContext: StateContext<CalendarEvent[]> = {
        value: eventsList,
        setValue: setEventsList
    }
    return (
        <>
            <EventListContext value={eventListContext}>
                <ModalInputContext value={modalInputContext}>
                    <ModalStateContext value={modalContext}>
                        <WeekViewWeekOffsetContext value={weekOffsetContext}>
                            <SidebarCalendarMonthOffsetContext value={monthOffsetContext}>
                                {children}
                            </SidebarCalendarMonthOffsetContext>
                        </WeekViewWeekOffsetContext>
                    </ModalStateContext>
                </ModalInputContext>
            </EventListContext>
        </>
    );
}

export interface ModalInput {
    modalEventID: string,
    modalEventName: string,
    modalEventStart: string,
    modalEventEnd: string,
    modalEventDescription: string,
    isModalEventExisting: boolean
}