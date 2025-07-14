import React, {createContext, useContext, useState} from "react";
import "../../week-view-layout.css";
import {EventFormModal} from "./EventFormModal";
import {Header} from "./Header";
import {Aside} from "./Aside";
import {WeekView} from "./WeekView";
import {ModalStateContext, StateContext} from "./contexts";

export function Body(){
    const [isModalActive, setIsModalActive] = useState(false);
    const modalContext: StateContext<boolean> = {
        value: isModalActive,
        setValue: setIsModalActive
    };
    return (
        <ModalStateContext value={modalContext}>
            <EventFormModal />
            <Header />
            <main>
                <Aside />
                <WeekView />
            </main>
        </ModalStateContext>
    );
}