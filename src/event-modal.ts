"use strict";

async function loadEventModal() {
    await loadModalHTML();
    tieModalInputs();
    setupModalInput();
}

async function loadModalHTML(){
    const allElements: HTMLCollection = document.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i] as HTMLElement;
        const file: string | null = element.getAttribute("html-file");
        if (file) {
            const i: Response = await fetch(file);
            element.innerHTML = await i.text();
        }
    }
}

function tieModalInputs() {
    const modal = document.getElementsByClassName(CLASSES.EventCreationModal)[0] as HTMLElement;

    const newEventModalCallers: HTMLCollection = document.getElementsByClassName(CLASSES.NewEventModalCaller);
    for (let i = 0; i < newEventModalCallers.length; i++) {
        const element = newEventModalCallers[i] as HTMLElement;
        element.onclick = () => {
            callModal();
            inputFillingByOffset(new Date(), 60);
        };
    }

    const modalCancelButtons: HTMLCollection = modal.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_Buttons_Close);
    for (let i = 0; i < modalCancelButtons.length; i++) {
        const element = modalCancelButtons[i] as HTMLElement;
        element.onclick = () => modal.style.display = "none";
    }

    const modalDeleteButtons: HTMLCollection = modal.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_Buttons_Delete);
    for (let i = 0; i < modalDeleteButtons.length; i++) {
        const element = modalDeleteButtons[i] as HTMLElement;
        element.onclick = () => modal.style.display = "none";
    }

    const calendarColumns: HTMLCollection = document.getElementsByClassName(CLASSES.WeekView_CalendarGrid_CalendarColumn);
    for (let i = 0; i < calendarColumns.length; i++) {
        const calendarButtons: HTMLCollection = calendarColumns[i].getElementsByClassName(CLASSES.WeekView_CalendarGrid_CalendarColumn_Cell_Button);
        for (let j = 0; j < calendarButtons.length; j++) {
            const element = calendarButtons[j] as HTMLElement;
            element.onclick = () => {
                callModal();
                const date: Date = new Date(calendarColumns[i].getAttribute(ATTRIBUTES.CalendarDay) ?? "");
                inputFillingByOffset(new Date(date.getTime() + j*60*60000), 60);
            };
        }
    }

    const modalTitleInput = modal.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_TitleInput)[0] as HTMLElement;
    modalTitleInput.addEventListener("input", () => {
        modalTitleInput.classList.remove(CLASSES.EventCreationModal_Body_Form_Input_Error);
    });
    const modalTimeInputs = modal.querySelectorAll(".modal-content__event-start-input, .modal-content__event-end-input");
    for (let i = 0; i < modalTimeInputs.length; i++) {
        modalTimeInputs[i].addEventListener("input", () => {
            for (let j = 0; j < modalTimeInputs.length; j++) {
                modalTimeInputs[j].classList.remove(CLASSES.EventCreationModal_Body_Form_Input_Error);
            }
        });
    }
}

function clearInputErrorUI(){
    const erroredInputs = Array.from(document.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_Input_Error)) as HTMLElement[];
    for (let i = 0; i < erroredInputs.length; i++) {
        erroredInputs[i].classList.remove(CLASSES.EventCreationModal_Body_Form_Input_Error);
    }
}

function callModal() {
    clearInputErrorUI();
    const modal = document.getElementsByClassName(CLASSES.EventCreationModal)[0] as HTMLElement;
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
    const idInput = document.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_EventID)[0] as HTMLInputElement;
    idInput.value = eventID;

    const deleteButton = document.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_Buttons_Delete)[0] as HTMLButtonElement;
    if (eventID === "") deleteButton.style.display = "none";
    else deleteButton.style.display = "block";

    const eventTitleInputElement = document.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_TitleInput)[0] as HTMLInputElement;
    eventTitleInputElement.value = title;

    const startInputElement = document.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_EventStartInput)[0] as HTMLInputElement;
    startInputElement.value = toISOLocaleString(startValue);

    const endInputElement = document.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_EventEndInput)[0] as HTMLInputElement;
    endInputElement.value = toISOLocaleString(endValue);

    const eventDescriptionInputElement = document.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_EventDescriptionInput)[0] as HTMLInputElement;
    eventDescriptionInputElement.value = description;
}

function setupModalInput() {
    const modalForm = document.getElementById("new-event-modal-form") as HTMLFormElement | null;
    modalForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        let formData: FormData = new FormData(event.target as HTMLFormElement);
        let eventID: string | undefined = formData.get(FORM_IDS.EventID)?.toString();
        if (eventID === undefined) throw new AttributeError("Cannot get event-id form attribute");
        if (event.submitter?.classList.contains(CLASSES.EventCreationModal_Body_Form_Buttons_Delete)) {
            await removeEvent(eventID);
            removeRenderEvent(eventID);
            return;
        }
        const modal = document.getElementsByClassName(CLASSES.EventCreationModal)[0] as HTMLElement;
        validateForm(formData, async ()=>{
            modal.style.display = "none";
            modalForm.reset();

            const elements: HTMLCollection = modal.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove(CLASSES.EventCreationModal_Body_Form_Input_Error);
            }

            const eventName = formData.get(FORM_IDS.EventTitle)?.toString() ?? "";
            const eventDescription = formData.get(FORM_IDS.EventDescription)?.toString() ?? "";
            const eventStart = formData.get(FORM_IDS.EventStart)?.toString() ?? "";
            const eventEnd = formData.get(FORM_IDS.EventEnd)?.toString() ?? "";

            if (event.submitter?.classList.contains(CLASSES.EventCreationModal_Body_Form_Buttons_Submit)) {
                if (eventID === "") {
                    eventID = performance.now().toString();
                    await addEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd), eventDescription);
                    renderEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd));
                }
                else if (eventID !== undefined) {
                    await modifyEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd), eventDescription);
                    reRenderEvent(eventID, eventName, new Date(eventStart), new Date(eventEnd));
                }
            }
        },
        (error: ValidationErrors) => {
            switch (error){
                case ValidationErrors.Title:
                    const titleInput = modal.getElementsByClassName(CLASSES.EventCreationModal_Body_Form_TitleInput)[0];
                    titleInput.classList.add(CLASSES.EventCreationModal_Body_Form_Input_Error);
                    break;
                case ValidationErrors.Time:
                    const timeInput = modal.querySelectorAll(".modal-content__event-start-input, .modal-content__event-end-input");
                    for (let i = 0; i < timeInput.length; i++) {
                        timeInput[i].classList.add(CLASSES.EventCreationModal_Body_Form_Input_Error);
                    }
                    break;
            }
        });
    })
}

function validateForm(formData: FormData, onSuccess: () => void, onError: (error: ValidationErrors) => void) {
    const eventTitle: string | undefined = formData.get(FORM_IDS.EventTitle)?.toString();
    const eventStartTimeString: string | undefined = formData.get(FORM_IDS.EventStart)?.toString();
    const eventEndTimeString: string | undefined = formData.get(FORM_IDS.EventEnd)?.toString();

    if (eventStartTimeString === undefined) throw new AttributeError("Cannot get event-start form attribute");
    if (eventEndTimeString === undefined) throw new AttributeError("Cannot get event-end form attribute");
    if (eventTitle === undefined) throw new AttributeError("Cannot get event-title form attribute");

    const eventStartTime: number = new Date(eventStartTimeString).getTime();
    const eventEndTime: number = new Date(eventEndTimeString).getTime();
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

