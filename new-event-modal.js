

async function loadNewEventModal() {
    await loadModalHTML();
    tieButtons();
    readModalInput();
    //inputFilling(new Date(), 60);
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
    const elements = document.getElementsByClassName("new-event-modal-caller")
    const modal = document.getElementsByClassName("event-creation-modal")[0];
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        element.onclick = () => {modal.style.display = "flex"; inputFilling(new Date(), 60);};
    }

    const modalButtons = modal.getElementsByClassName("modal-content__buttons--close");
    for (let i = 0; i < modalButtons.length; i++) {
        const element = modalButtons[i];
        element.onclick = () => modal.style.display = "none";
    }

    const calendarColumns = document.getElementsByClassName("calendar-grid__calendar-column-0");
    for (let i = 0; i < calendarColumns.length; i++) {
        const calendarButtons = calendarColumns[i].getElementsByClassName("calendar-cell__button");
        for (let j = 0; j < calendarButtons.length; j++) {
            const element = calendarButtons[j];
            element.onclick = () => {modal.style.display = "flex";
                const date = new Date(calendarColumns[i].getAttribute("data-calendar-day"));
                inputFilling(new Date(date.getTime() + j*60*60000), 60);

            };
        }
    }

}

function inputFilling(startValue, minuteOffset) {

    const endValue = new Date(startValue.getTime() + minuteOffset*60000)

    const startInputElements = document.getElementsByClassName("modal-content__event-start-input");
    for (let i = 0; i < startInputElements.length; i++) {
        const element = startInputElements[i];
        element.value = startValue.toISOLocaleString();
    }
    const endInputElements = document.getElementsByClassName("modal-content__event-end-input");
    for (let i = 0; i < endInputElements.length; i++) {
        const element = endInputElements[i];
        element.value = endValue.toISOLocaleString();
    }

}

function readModalInput() {
    const modalForm = document.getElementById("new-event-modal-form");
    modalForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let formData = new FormData(event.target);

        const modal = document.getElementsByClassName("event-creation-modal")[0];
        validateForm(formData, ()=>{
            modal.style.display = "none";
            modalForm.reset();

            const elements = modal.getElementsByTagName("*");
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("modal-content__input--error");
            }

            renderEvent(new Date(formData.get("event-start")), new Date(formData.get("event-end")), formData.get("event-title"));
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

Date.prototype.toISOLocaleString = function () {
    return `${this.getFullYear()}-${(this.getMonth()+1).leftPad(2)}-${this.getDate().leftPad(2)}T${this.getHours().leftPad(2)}:${this.getMinutes().leftPad(2)}`;
}
Number.prototype.leftPad = function (size = 2) {
    let s = String(this);
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}