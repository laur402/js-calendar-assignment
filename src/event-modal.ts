"use strict";

async function loadEventModal() {
    await loadModalHTML();
    tieModalInputs();
    setupModalInput();
}

async function loadModalHTML(){
    const allElements: HTMLCollection = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        const element: HTMLElement = allElements[i] as HTMLElement;
        const file: string | null = element.getAttribute("html-file");
        if (file) {
            const i = await fetch(file);
            element.innerHTML = await i.text();
        }
    }
}

function tieModalInputs() {
    const modal: HTMLElement = document.getElementsByClassName("event-creation-modal")[0] as HTMLElement;

    const newEventModalCallers: HTMLCollection = document.getElementsByClassName("new-event-modal-caller");
    for (let i = 0; i < newEventModalCallers.length; i++) {
        const element = newEventModalCallers[i] as HTMLElement;
        element.onclick = () => {
            callModal();
            inputFillingByOffset(new Date(), 60);
        };
    }

    const modalCancelButtons: HTMLCollection = modal.getElementsByClassName("modal-content__buttons--close");
    for (let i = 0; i < modalCancelButtons.length; i++) {
        const element: HTMLElement = modalCancelButtons[i] as HTMLElement;
        element.onclick = () => modal.style.display = "none";
    }

    const modalDeleteButtons: HTMLCollection = modal.getElementsByClassName("modal-content__buttons--delete");
    for (let i = 0; i < modalDeleteButtons.length; i++) {
        const element: HTMLElement = modalDeleteButtons[i] as HTMLElement;
        element.onclick = () => modal.style.display = "none";
    }

    const calendarColumns: HTMLCollection = document.getElementsByClassName("calendar-grid__calendar-column-0");
    for (let i = 0; i < calendarColumns.length; i++) {
        const calendarButtons: HTMLCollection = calendarColumns[i].getElementsByClassName("calendar-cell__button");
        for (let j = 0; j < calendarButtons.length; j++) {
            const element: HTMLElement = calendarButtons[j] as HTMLElement;
            element.onclick = () => {
                callModal();
                const date = new Date(calendarColumns[i].getAttribute("data-calendar-day") ?? "");
                inputFillingByOffset(new Date(date.getTime() + j*60*60000), 60);
            };
        }
    }

    const modalTitleInput: HTMLElement = modal.getElementsByClassName("modal-content__event-title-input")[0] as HTMLElement;
    modalTitleInput.addEventListener("input", () => {
        modalTitleInput.classList.remove("modal-content__input--error");
    });
    const modalTimeInputs = modal.querySelectorAll(".modal-content__event-start-input, .modal-content__event-end-input");
    for (let i = 0; i < modalTimeInputs.length; i++) {
        modalTimeInputs[i].addEventListener("input", () => {
            for (let j = 0; j < modalTimeInputs.length; j++) {
                modalTimeInputs[j].classList.remove("modal-content__input--error");
            }
        });
    }
}

function clearInputErrorUI(){
    const erroredInputs: HTMLElement[] = Array.from(document.getElementsByClassName("modal-content__input--error")) as HTMLElement[];
    for (let i = 0; i < erroredInputs.length; i++) {
        erroredInputs[i].classList.remove("modal-content__input--error");
    }
}

function callModal() {
    clearInputErrorUI();
    const modal: HTMLElement = document.getElementsByClassName("event-creation-modal")[0] as HTMLElement;
    modal.style.display = "flex";
}

async function inputFillingByID(eventID: string){
    const event: CalendarEvent | null = await getEvent(eventID);
    if (event === null) inputFilling(new Date(), new Date(), "", "", eventID);
    else inputFilling(event.eventStart, event.eventEnd, event.eventName, event.eventDescription, event.eventId);
}

function inputFillingByOffset(startValue: Date, minuteOffset: number) {
    const endValue: Date = new Date(startValue.getTime() + minuteOffset * 60000);
    inputFilling(startValue, endValue, "", "");
}

function inputFilling(startValue: Date, endValue: Date, title: string, description: string, eventID: string = "") {
    const idInput = document.getElementsByClassName("modal-content__event-id")[0] as HTMLInputElement;
    idInput.value = eventID;

    const deleteButton = document.getElementsByClassName("modal-content__buttons--delete")[0] as HTMLButtonElement;
    if (eventID === "") deleteButton.style.display = "none";
    else deleteButton.style.display = "block";

    const eventTitleInputElement = document.getElementsByClassName("modal-content__event-title-input")[0] as HTMLInputElement;
    eventTitleInputElement.value = title;

    const startInputElement = document.getElementsByClassName("modal-content__event-start-input")[0] as HTMLInputElement;
    startInputElement.value = startValue.toISOLocaleString();

    const endInputElement = document.getElementsByClassName("modal-content__event-end-input")[0] as HTMLInputElement;
    endInputElement.value = endValue.toISOLocaleString();

    const eventDescriptionInputElement = document.getElementsByClassName("modal-content__event-description-input")[0] as HTMLInputElement;
    eventDescriptionInputElement.value = description;
}

function setupModalInput() {
    const modalForm: HTMLFormElement | null = document.getElementById("new-event-modal-form") as HTMLFormElement | null;
    modalForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        let formData: FormData = new FormData(event.target as HTMLFormElement);

        let eventID: string = formData.get("event-id")?.toString() ?? ""; //TODO: Replace with error
        if (event.submitter?.classList.contains("modal-content__buttons--delete")) {
            removeEvent(eventID);
            removeRenderEvent(eventID);
            return;
        }
        const modal: HTMLElement = document.getElementsByClassName("event-creation-modal")[0] as HTMLElement;
        validateForm(formData, ()=>{
            modal.style.display = "none";
            modalForm.reset();

            const elements: HTMLCollection = modal.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("modal-content__input--error");
            }

            const eventName = formData.get("event-title")?.toString() ?? "";
            const eventDescription = formData.get("event-description")?.toString() ?? "";
            const eventStart = formData.get("event-start")?.toString() ?? "";
            const eventEnd = formData.get("event-end")?.toString() ?? "";

            if (event.submitter?.classList.contains("modal-content__buttons--submit")) {
                if (eventID === "") {
                    eventID = performance.now().toString();
                    addEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd), eventDescription);
                    renderEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd));
                }
                else {
                    modifyEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd), eventDescription);
                    reRenderEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd));
                }
            }
        },
        (error: ValidationErrors) => {
            switch (error){
                case ValidationErrors.Title:
                    const titleInput = modal.getElementsByClassName("modal-content__event-title-input")[0];
                    titleInput.classList.add("modal-content__input--error");
                    break;
                case ValidationErrors.Time:
                    const timeInput = modal.querySelectorAll(".modal-content__event-start-input, .modal-content__event-end-input");
                    for (let i = 0; i < timeInput.length; i++) {
                        timeInput[i].classList.add("modal-content__input--error");
                    }
                    break;
            }
        });
    })
}

function validateForm(formData: FormData, onSuccess: () => void, onError: (error: ValidationErrors) => void) {
    const eventTitle: string = formData.get("event-title")?.toString() ?? ""; //TODO: Replace with error
    const eventStartTime: number = new Date(formData.get("event-start")?.toString() ?? "").getTime();
    const eventEndTime: number = new Date(formData.get("event-end")?.toString() ?? "").getTime();
    if (eventTitle === '') {
        onError(ValidationErrors.Title);
        return;
    }
    if (eventEndTime < eventStartTime) {
        onError(ValidationErrors.Time);
        return;
    }
    onSuccess();
}
enum ValidationErrors {
    Title,
    Time
}

