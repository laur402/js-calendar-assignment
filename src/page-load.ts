window.onload = async () => {
    await loadEventModal();
    tieHeaderButtons();
    loadSidebarCalendar();
    tieSidebarCalendarHeaderButtons();
    await loadMainCalendarElements();
    setInterval(() => {
        removeCurrentTimeGraphic();
        loadCurrentTimeGraphic(new Date());
        }, 60*1000);
}

async function loadMainCalendarElements() {
    await loadWeekView();
    loadCurrentTimeGraphic(LOAD_TIME);
}


function tieHeaderButtons(){
    const header: Element = document.getElementsByClassName('header')[0];
    const todayButton: Element = header.getElementsByClassName('header-buttons__today')[0];
    const leftButton: Element = header.getElementsByClassName("header-buttons__week-left")[0];
    const rightButton: Element = header.getElementsByClassName("header-buttons__week-right")[0];

    todayButton.addEventListener("click", async () => {
        weekOffset = 0;
        sidebarCalendarOffset = 0;
        await loadMainCalendarElements();
        loadSidebarCalendar();
    });
    leftButton.addEventListener("click", async () => {
        weekOffset -= 1;
        await loadMainCalendarElements();
    });
    rightButton.addEventListener("click", async () => {
        weekOffset += 1;
        await loadMainCalendarElements();
    });
}
function tieSidebarCalendarHeaderButtons(){
    const buttonLeft: Element = document.getElementsByClassName("calendar-modal-header-buttons__month-left")[0];
    const buttonRight: Element = document.getElementsByClassName("calendar-modal-header-buttons__month-right")[0];
    buttonLeft.addEventListener("click", () => {
        sidebarCalendarOffset--;
        loadSidebarCalendar();
    })
    buttonRight.addEventListener("click", () => {
        sidebarCalendarOffset++;
        loadSidebarCalendar();
    })
}