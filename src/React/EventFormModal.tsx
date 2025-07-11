import React, {FormEvent, SyntheticEvent, useState} from "react";
import "../../event-creation-modal-layout.css";
interface EventFormModalProps {
    isModalActive: boolean,
    setIsModalActive:(val: boolean) => void
}
export function EventFormModal({isModalActive, setIsModalActive}:EventFormModalProps){
    const [eventID, setEventID] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventStart, setEventStart] = useState("");
    const [eventEnd, setEventEnd] = useState("");
    const [eventDescription, setEventDescription] = useState("");

    const [isTitleError, setIsTitleError] = useState(false);
    const [isTimeError, setIsTimeError] = useState(false);
    return (
        <section className="modal" style={{display: `${isModalActive ? "flex" : "none"}`}}>
            <form className="modal-content" id="new-event-modal-form"
                  onSubmit={(e) => handleEventFormInput(e, setIsModalActive, (v) => setIsTitleError(v), (v) => setIsTimeError(v))}>
                <input className="modal-content__event-id" type="hidden" name="event-id"
                       value={eventID}
                       onChange={(e) => setEventID(e.target.value)}/>

                <input className={`modal-content__event-title-input ${isTitleError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                       id="title" name="event-title"
                       type="text" placeholder="Event title" aria-label="Event title"
                       value={eventName}
                       onChange={(e)=> {
                           setEventName(e.target.value);
                           setIsTitleError(false);
                       }}/>

                <span className="material-symbols-outlined">calendar_clock</span>
                <div className="modal-content__event-time-inputs">
                    <input className={`modal-content__event-start-input ${isTimeError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`}
                           id="event-start" name="event-start"
                           type="datetime-local" aria-label="Event start"
                           value={eventStart}
                           onChange={(e)=> {
                               setEventStart(e.target.value);
                               setIsTimeError(false);
                           }}/>
                    <input className={`modal-content__event-end-input ${isTimeError ? CLASSES.EventCreationModal_Body_Form_Input_Error : ""}`} id="event-end" name="event-end"
                           type="datetime-local" aria-label="Event end"
                           value={eventEnd}
                           onChange={(e)=>{
                               setEventEnd(e.target.value);
                               setIsTimeError(false);
                           }}/>
                </div>

                <span className="material-symbols-outlined">notes</span>
                <textarea className="modal-content__event-description-input" id="event-description" name="event-description"
                          rows={5} cols={2} placeholder="Add description" aria-label="Event description"
                          value={eventDescription}
                          onChange={(e)=>setEventDescription(e.target.value)}></textarea>

                <div className="modal-content__buttons">
                    <button className="modal-content__buttons--close">Cancel</button>
                    <input type="submit" className="modal-content__buttons--delete" value="Delete"/>
                    <input type="submit" className="modal-content__buttons--submit" value="Save"/>
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

function dispatchEvent(eventData: EventFormData) {
    const calendarEvent: CalendarEvent = {
        eventId: eventData.eventId === undefined ? performance.now().toString() : eventData.eventId,
        eventName: eventData.eventName,
        eventStart: new Date(eventData.eventStart),
        eventEnd: new Date(eventData.eventEnd),
        eventDescription: eventData.eventDescription
    }
    if (eventData.eventId === "") {
        /*TODO:
        eventData.eventId = performance.now().toString();
        await addEvent(calendarEvent);
        renderEvent(calendarEvent);*/
    } else if (eventData.eventId !== undefined) {
        /*TODO:
        await modifyEvent(calendarEvent);
        reRenderEvent(calendarEvent);*/
    }
}

function handleEventFormInput(event: SyntheticEvent, setIsModalActive: (value: boolean) => void,
                              setIsTitleError: (value: boolean) => void, setIsTimeError: (value: boolean) => void)
{
    event.preventDefault();
    const formData: FormData = new FormData(event.target as HTMLFormElement);
    const eventData = extractFormData(formData);
    const eventSubmitter = (event.nativeEvent as SubmitEvent).submitter;
    const isDeleteButton = eventSubmitter?.classList.contains(CLASSES.EventCreationModal_Body_Form_Buttons_Delete);
    if (isDeleteButton) {
        /*await removeEvent(eventID);
        removeRenderEvent(eventID);
        return;*/
    }
    const validationResult = validateForm(eventData);
    switch (validationResult.type){
        case "success":
            setIsModalActive(false);
            dispatchEvent(eventData);
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

type EventFormData = {
    eventId: string,
    eventName: string,
    eventStart: string,
    eventEnd: string,
    eventDescription: string
}