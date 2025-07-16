import React, {createContext, Dispatch, FormEvent, SetStateAction, SyntheticEvent, useContext, useState} from "react";
import "../../event-creation-modal-layout.css";
import {AttributeError} from "../helper-functions";
import {CLASSES, FORM_IDS} from "../constants";
import {addEvent, CalendarEvent, modifyEvent, removeEvent} from "../event-storage";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {ModalInput, modalInputModify} from "./redux/modalInputSlice";
import {eventListAdd, eventListModify, eventListRemoveByID} from "./redux/eventListSlice";
import {modalStateHide} from "./redux/modalStateSlice";
import {ThunkDispatch} from "@reduxjs/toolkit";

export function EventFormModal(){
    const dispatch = useAppDispatch();
    const modalState = useAppSelector((state)=> state.modalState);
    const modalInputState = useAppSelector(state => state.modalInput);
    const [isTitleError, setIsTitleError] = useState(false);
    const [isTimeError, setIsTimeError] = useState(false);
    return (
        <section className={`${CLASSES.EventCreationModal_Body} ${CLASSES.EventCreationModal}`}
                 style={{display: `${modalState.value ? "flex" : "none"}`}}>
            <form className={`${CLASSES.EventCreationModal_Body_Form}`} id="new-event-modal-form"
                  onSubmit={(e) => handleEventFormInput(e, dispatch, (v) => setIsTitleError(v), (v) => setIsTimeError(v))}>
                <input className={`${CLASSES.EventCreationModal_Body_Form_EventID}`} type="hidden" name="event-id"
                       value={modalInputState.modalEventID}
                       onChange={(e) =>
                           dispatch(modalInputModify({modalEventID: e.target.value}))
                }/>

                <input className={`${CLASSES.EventCreationModal_Body_Form_TitleInput} ${isTitleError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                       id={FORM_IDS.EventTitle} name="event-title"
                       type="text" placeholder="Event title" aria-label="Event title"
                       value={modalInputState.modalEventName}
                       onChange={(e)=> {
                           dispatch(modalInputModify({modalEventName: e.target.value}))
                           setIsTitleError(false);
                       }}/>

                <span className={`${CLASSES.MaterialSymbolsOutlined}`}>calendar_clock</span>
                <div className={`${CLASSES.EventCreationModal_Body_Form_EventTimeInputs}`}>
                    <input className={`${CLASSES.EventCreationModal_Body_Form_EventStartInput} ${isTimeError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                           id={FORM_IDS.EventStart} name="event-start"
                           type="datetime-local" aria-label="Event start"
                           value={modalInputState.modalEventStart}
                           onChange={(e)=> {
                               dispatch(modalInputModify({modalEventStart: e.target.value}))
                               setIsTimeError(false);
                           }}/>
                    <input className={`${CLASSES.EventCreationModal_Body_Form_EventEndInput} ${isTimeError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                           id={FORM_IDS.EventEnd} name="event-end"
                           type="datetime-local" aria-label="Event end"
                           value={modalInputState.modalEventEnd}
                           onChange={(e)=>{
                               dispatch(modalInputModify({modalEventEnd: e.target.value}))
                               setIsTimeError(false);
                           }}/>
                </div>

                <span className={`${CLASSES.MaterialSymbolsOutlined}`}>notes</span>
                <textarea className={`${CLASSES.EventCreationModal_Body_Form_EventDescriptionInput}`} id={FORM_IDS.EventDescription} name="event-description"
                          rows={5} cols={2} placeholder="Add description" aria-label="Event description"
                          value={modalInputState.modalEventDescription}
                          onChange={(e)=>
                              dispatch(modalInputModify({modalEventDescription: e.target.value}))
                }></textarea>

                <div className={`${CLASSES.EventCreationModal_Body_Form_Buttons}`}>
                    <button className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Close}`}
                            onClick={(event)=>{
                                event?.preventDefault();
                                dispatch(modalStateHide());
                            }}>Cancel</button>
                    {modalInputState.isModalEventExisting && <input type="submit" className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Delete}`} value="Delete"/>}
                    <input type="submit" className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Submit}`} value="Save"/>
                </div>
            </form>
        </section>
    );
}

function extractFormData(formData: FormData) {
    const eventID: string | undefined = formData.get(FORM_IDS.EventID)?.toString();
    if (eventID === undefined) throw new AttributeError("Cannot get event-id form attribute");
    const eventData: EventFormData = {
        eventId: eventID,
        eventName: formData.get(FORM_IDS.EventTitle)?.toString() ?? "",
        eventStart: formData.get(FORM_IDS.EventStart)?.toString() ?? "",
        eventEnd: formData.get(FORM_IDS.EventEnd)?.toString() ?? "",
        eventDescription: formData.get(FORM_IDS.EventDescription)?.toString() ?? "",
    }
    return eventData;
}

async function dispatchEvent(eventData: EventFormData, dispatch: ThunkDispatch<any, any, any>) {
    const calendarEvent: CalendarEvent = {
        eventId: eventData.eventId === undefined ? performance.now().toString() : eventData.eventId,
        eventName: eventData.eventName,
        eventStart: new Date(eventData.eventStart),
        eventEnd: new Date(eventData.eventEnd),
        eventDescription: eventData.eventDescription
    }
    if (eventData.eventId === "") {
        calendarEvent.eventId = performance.now().toString();
        await addEvent(calendarEvent);
        dispatch(eventListAdd(calendarEvent));
    } else if (eventData.eventId !== undefined) {
        await modifyEvent(calendarEvent);
        dispatch(eventListModify(calendarEvent));
    }
}

async function handleEventFormInput(event: SyntheticEvent, dispatch: ThunkDispatch<any, any, any>,
                              setIsTitleError: (value: boolean) => void, setIsTimeError: (value: boolean) => void)
{
    event.preventDefault();
    const formData: FormData = new FormData(event.target as HTMLFormElement);
    const eventData = extractFormData(formData);
    const eventSubmitter = (event.nativeEvent as SubmitEvent).submitter;
    const isDeleteButton = eventSubmitter?.classList.contains(CLASSES.EventCreationModal_Body_Form_Buttons_Delete);
    if (isDeleteButton) {
        await removeEvent(eventData.eventId);
        dispatch(eventListRemoveByID(eventData.eventId))
        dispatch(modalStateHide());
        return;
    }
    const validationResult = validateForm(eventData);
    switch (validationResult.type){
        case "success":
            dispatch(modalStateHide());
            await dispatchEvent(eventData, dispatch);
            break;
        case "error":
            switch (validationResult.error){
                case ValidationErrorTypes.Title:
                    setIsTitleError(true);
                    break;
                case ValidationErrorTypes.Time:
                    setIsTimeError(true);
                    break;
            }
            break;
    }
}

function validateForm(eventData: EventFormData): ValidationReturn {
    if (eventData.eventName === ""){
        return {
            type: "error",
            error: ValidationErrorTypes.Title
        };
    }
    if (eventData.eventStart === "" || eventData.eventEnd === ""){
        return {
            type: "error",
            error: ValidationErrorTypes.Time
        };
    }
    return { type: "success" };
}


interface ValidationError {
    type: "error"
    error: ValidationErrorTypes
}
interface ValidationSuccess {
    type: "success"
}
type ValidationReturn = ValidationSuccess | ValidationError;
enum ValidationErrorTypes {
    Title,
    Time
}

interface EventFormData {
    eventId: string,
    eventName: string,
    eventStart: string,
    eventEnd: string,
    eventDescription: string,
}