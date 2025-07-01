"use strict";

async function loadEventModal() {
    await loadModalHTML();
    tieButtons();
    setupModalInput();
}

async function loadModalHTML(){
    const allElements = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];
        const file = element.getAttribute("html-file");
        if (file) {
            const i = await fetch(file);
            element.innerHTML = await i.text();
        }
    }
}

function tieButtons() {
    const elements = document.getElementsByClassName("new-event-modal-caller");
    const modal = document.getElementsByClassName("event-creation-modal")[0];
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.onclick = () => {callModal(); inputFillingByOffset(new Date(), 60);};
    }

    const modalCancelButtons = modal.getElementsByClassName("modal-content__buttons--close");
    for (let i = 0; i < modalCancelButtons.length; i++) {
        const element = modalCancelButtons[i];
        element.onclick = () => modal.style.display = "none";
    }

    const modalDeleteButtons = modal.getElementsByClassName("modal-content__buttons--delete");
    for (let i = 0; i < modalDeleteButtons.length; i++) {
        const element = modalDeleteButtons[i];
        element.onclick = () => modal.style.display = "none";
    }

    const calendarColumns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    for (let i = 0; i < calendarColumns.length; i++) {
        const calendarButtons = calendarColumns[i].getElementsByClassName("calendar-cell__button");
        for (let j = 0; j < calendarButtons.length; j++) {
            const element = calendarButtons[j];
            element.onclick = () => {
                callModal();
                const date = new Date(calendarColumns[i].getAttribute("data-calendar-day"));
                inputFillingByOffset(new Date(date.getTime() + j*60*60000), 60);
            };
        }
    }
}

function callModal() {
    const modal = document.getElementsByClassName("event-creation-modal")[0];
    modal.style.display = "flex";
}

function inputFillingByID(eventID){
    const event = getEvent(eventID);
    if (event === null) inputFilling(new Date(), new Date(), "", "", eventID);
    else inputFilling(event.eventStart, event.eventEnd, event.eventName, event.eventDescription, event.eventId);
}

function inputFillingByOffset(startValue, minuteOffset) {
    const endValue = new Date(startValue.getTime() + minuteOffset*60000);
    inputFilling(startValue, endValue, "", "");
}

function inputFilling(startValue, endValue, title, description, eventID = "") {
    const idInput = document.getElementsByClassName("modal-content__event-id")[0];
    idInput.value = eventID;

    const deleteButton = document.getElementsByClassName("modal-content__buttons--delete")[0];
    if (eventID === "") deleteButton.style.display = "none";
    else deleteButton.style.display = "block";

    const eventTitleInputElement = document.getElementsByClassName("modal-content__event-title-input")[0];
    eventTitleInputElement.value = title;

    const startInputElement = document.getElementsByClassName("modal-content__event-start-input")[0];
    startInputElement.value = startValue.toISOLocaleString();

    const endInputElement = document.getElementsByClassName("modal-content__event-end-input")[0];
    endInputElement.value = endValue.toISOLocaleString();

    const eventDescriptionInputElement = document.getElementsByClassName("modal-content__event-description-input")[0];
    eventDescriptionInputElement.value = description;
}

function setupModalInput() {
    const modalForm = document.getElementById("new-event-modal-form");
    modalForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let formData = new FormData(event.target);

        let eventID = formData.get("event-id");
        if (event.submitter.classList.contains("modal-content__buttons--delete")) {
            removeEvent(eventID);
            removeRenderEvent(eventID);
            return;
        }
        const modal = document.getElementsByClassName("event-creation-modal")[0];
        validateForm(formData, ()=>{
            modal.style.display = "none";
            modalForm.reset();

            const elements = modal.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("modal-content__input--error");
            }

            const eventName = formData.get("event-title");
            const eventDescription = formData.get("event-description");
            const eventStart = formData.get("event-start");
            const eventEnd = formData.get("event-end");

            //console.log(eventID);
            if (event.submitter.classList.contains("modal-content__buttons--submit")) {
                if (eventID === "") {
                    eventID = performance.now().toString();
                    addEvent(eventID, eventName, eventStart, eventEnd, eventDescription);
                    renderEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd));
                }
                else {
                    modifyEvent(eventID, eventName, eventStart, eventEnd, eventDescription);
                    reRenderEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd));
                }
            }
        },
        (error) => {
            switch (error){
                case "title":
                    const titleInput = modal.getElementsByClassName("modal-content__event-title-input")[0];
                    titleInput.classList.add("modal-content__input--error");
                    break;
                case "time":
                    const timeInput = modal.querySelectorAll(".modal-content__event-start-input, .modal-content__event-end-input");
                    for (let i = 0; i < timeInput.length; i++) {
                        timeInput[i].classList.add("modal-content__input--error");
                    }
                    break;
            }
        });

        /*console.log(Object.fromEntries(formData));
        for (let o of formData.entries()){
            console.log(o);
        }*/
    })
}

function validateForm(formData, onSuccess, onError) {
    const eventTitle = formData.get("event-title");
    const eventStartTime = new Date(formData.get("event-start")).getTime();
    const eventEndTime = new Date(formData.get("event-end")).getTime();
    if (eventTitle === ''){
        onError("title");
        return;
    }
    if (eventEndTime < eventStartTime)
    {
        onError("time");
        return;
    }
    onSuccess();
}

