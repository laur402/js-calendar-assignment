import React, {useState} from "react";
import "../../week-view-layout.css";
import {EventFormModal} from "./EventFormModal";
import {Header} from "./Header";
import {Aside} from "./Aside";
import {WeekView} from "./WeekView";

export function Body(){
    const [isModalActive, setIsModalActive] = useState(false);
    return (
        <>
            <EventFormModal isModalActive={isModalActive} setIsModalActive={(v: boolean)=>setIsModalActive(v)}/>
            <Header />
            <main>
                <Aside />
                <WeekView />
            </main>
        </>
    );
}