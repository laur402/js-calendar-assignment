window.onload = async () => {
    loadWeekView();
    await loadEventModal();
    tieHeaderButtons();
    loadSidebarCalendar();
    tieSidebarCalendarHeaderButtons();
    loadCurrentTimeGraphic(TODAY);
    setInterval(() => {removeCurrentTimeGraphic(); loadCurrentTimeGraphic(new Date());}, 60*1000);
}

function loadMainCalendarElements() {
    loadWeekView();
    loadCurrentTimeGraphic(TODAY);
}


function tieHeaderButtons(){
    const header: Element = document.getElementsByClassName('header')[0];
    const todayButton: Element = header.getElementsByClassName('header-buttons__today')[0];
    const leftButton: Element = header.getElementsByClassName("header-buttons__week-left")[0];
    const rightButton: Element = header.getElementsByClassName("header-buttons__week-right")[0];

    todayButton.addEventListener("click", () => {
        weekOffset = 0;
        sidebarCalendarOffset = 0;
        loadMainCalendarElements();
        loadSidebarCalendar();
    });
    leftButton.addEventListener("click", () => {
        weekOffset -= 1;
        loadMainCalendarElements();
    });
    rightButton.addEventListener("click", () => {
        weekOffset += 1;
        loadMainCalendarElements();
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