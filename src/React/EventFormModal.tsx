import React, {createContext, Dispatch, FormEvent, SetStateAction, SyntheticEvent, useContext, useState} from "react";
import "../../event-creation-modal-layout.css";
import {EventListContext, ModalInputContext, ModalStateContext, StateContext, useStateContext} from "./contexts";
import {AttributeError} from "../helper-functions";
import {CLASSES, FORM_IDS} from "../constants";
import {addEvent, CalendarEvent, modifyEvent, removeEvent} from "../event-storage";
import {ModalInput} from "./Body";

export function EventFormModal(){
    const modalState = useStateContext(ModalStateContext);
    const modalInputState = useStateContext(ModalInputContext);
    const eventsListState = useStateContext(EventListContext);

    const [isTitleError, setIsTitleError] = useState(false);
    const [isTimeError, setIsTimeError] = useState(false);
    return (
        <section className={`${CLASSES.EventCreationModal_Body} ${CLASSES.EventCreationModal}`}
                 style={{display: `${modalState.value ? "flex" : "none"}`}}>
            <form className={`${CLASSES.EventCreationModal_Body_Form}`} id="new-event-modal-form"
                  onSubmit={(e) => handleEventFormInput(e, modalState.setValue, (v) => setIsTitleError(v), (v) => setIsTimeError(v), eventsListState)}>
                <input className={`${CLASSES.EventCreationModal_Body_Form_EventID}`} type="hidden" name="event-id"
                       value={modalInputState.value.modalEventID}
                       onChange={(e) =>
                           modalInputState?.setValue((prevState)=> {
                               const newState: ModalInput = {...prevState};
                               newState.modalEventID = e.target.value;
                               return newState;
                           })} />

                <input className={`${CLASSES.EventCreationModal_Body_Form_TitleInput} ${isTitleError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                       id={FORM_IDS.EventTitle} name="event-title"
                       type="text" placeholder="Event title" aria-label="Event title"
                       value={modalInputState.value.modalEventName}
                       onChange={(e)=> {
                           modalInputState?.setValue((prevState)=>{
                               const newState: ModalInput = {...prevState};
                               newState.modalEventName = e.target.value;
                               return newState;
                           });
                           setIsTitleError(false);
                       }}/>

                <span className={`${CLASSES.MaterialSymbolsOutlined}`}>calendar_clock</span>
                <div className={`${CLASSES.EventCreationModal_Body_Form_EventTimeInputs}`}>
                    <input className={`${CLASSES.EventCreationModal_Body_Form_EventStartInput} ${isTimeError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                           id={FORM_IDS.EventStart} name="event-start"
                           type="datetime-local" aria-label="Event start"
                           value={modalInputState.value.modalEventStart}
                           onChange={(e)=> {
                               modalInputState?.setValue((prevState)=>{
                                   const newState: ModalInput = {...prevState};
                                   newState.modalEventStart = e.target.value;
                                   return newState;
                               });
                               setIsTimeError(false);
                           }}/>
                    <input className={`${CLASSES.EventCreationModal_Body_Form_EventEndInput} ${isTimeError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                           id={FORM_IDS.EventEnd} name="event-end"
                           type="datetime-local" aria-label="Event end"
                           value={modalInputState.value.modalEventEnd}
                           onChange={(e)=>{
                               modalInputState?.setValue((prevState: ModalInput)=>{
                                   const newState: ModalInput = {...prevState};
                                   newState.modalEventEnd = e.target.value;
                                   return newState;
                               });
                               setIsTimeError(false);
                           }}/>
                </div>

                <span className={`${CLASSES.MaterialSymbolsOutlined}`}>notes</span>
                <textarea className={`${CLASSES.EventCreationModal_Body_Form_EventDescriptionInput}`} id={FORM_IDS.EventDescription} name="event-description"
                          rows={5} cols={2} placeholder="Add description" aria-label="Event description"
                          value={modalInputState.value.modalEventDescription}
                          onChange={(e)=>
                              modalInputState?.setValue((prevState: ModalInput)=>{
                                  const newState: ModalInput = {...prevState};
                                  newState.modalEventDescription = e.target.value;
                                  return newState;
                          })}></textarea>

                <div className={`${CLASSES.EventCreationModal_Body_Form_Buttons}`}>
                    <button className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Close}`}
                            onClick={(event)=>{
                                event?.preventDefault()
                                modalState?.setValue(false);
                            }}>Cancel</button>
                    {modalInputState.value.isModalEventExisting && <input type="submit" className={`${CLASSES.EventCreationModal_Body_Form_Buttons_Delete}`} value="Delete"/>}
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

async function dispatchEvent(eventData: EventFormData, eventsListContext: StateContext<CalendarEvent[]>) {
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
        eventsListContext.setValue((prevState)=>{
            const newState = [...prevState];
            newState.push(calendarEvent);
            return newState;
        });
    } else if (eventData.eventId !== undefined) {
        await modifyEvent(calendarEvent);
        eventsListContext?.setValue((prevState)=>{
            const newState = [...prevState];
            const matchingEventIndex = newState.findIndex(
                (event)=> event.eventId === calendarEvent.eventId
            );
            newState[matchingEventIndex] = calendarEvent;
            return newState;
        });
    }
}

async function handleEventFormInput(event: SyntheticEvent, setIsModalActive: Dispatch<SetStateAction<boolean>>,
                              setIsTitleError: (value: boolean) => void, setIsTimeError: (value: boolean) => void, eventsListContext: StateContext<CalendarEvent[]>)
{
    event.preventDefault();
    const formData: FormData = new FormData(event.target as HTMLFormElement);
    const eventData = extractFormData(formData);
    const eventSubmitter = (event.nativeEvent as SubmitEvent).submitter;
    const isDeleteButton = eventSubmitter?.classList.contains(CLASSES.EventCreationModal_Body_Form_Buttons_Delete);
    if (isDeleteButton) {
        await removeEvent(eventData.eventId);
        eventsListContext.setValue((prevState)=>{
            const newState = [...prevState];
            const eventIndex = newState.findIndex((event)=>event.eventId === eventData.eventId);
            newState.splice(eventIndex, 1);
            return newState;
        })
        setIsModalActive(false);
        return;
    }
    const validationResult = validateForm(eventData);
    switch (validationResult.type){
        case "success":
            setIsModalActive(false);
            await dispatchEvent(eventData, eventsListContext);
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