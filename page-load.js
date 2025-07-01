window.onload = async () => {
    loadWeekView();
    await loadEventModal();
    tieHeaderButtons();
    loadSidebarCalendar();
    tieSidebarCalendarHeaderButtons();
}


function tieHeaderButtons(){
    const header = document.getElementsByClassName('header')[0];
    const todayButton = header.getElementsByClassName('header-buttons__today')[0];
    const leftButton = header.getElementsByClassName("header-buttons__week-left")[0];
    const rightButton = header.getElementsByClassName("header-buttons__week-right")[0];

    todayButton.addEventListener("click", () => {
        weekOffset = 0;
        loadWeekView();
    });
    leftButton.addEventListener("click", () => {
        weekOffset -= 1;
        loadWeekView();
    });
    rightButton.addEventListener("click", () => {
        weekOffset += 1;
        loadWeekView();
    });
}
function tieSidebarCalendarHeaderButtons(){
    const buttonLeft = document.getElementsByClassName("calendar-modal-header-buttons__month-left")[0];
    const buttonRight = document.getElementsByClassName("calendar-modal-header-buttons__month-right")[0];
    buttonLeft.addEventListener("click", () => {
        sidebarCalendarOffset--;
        loadSidebarCalendar();
    })
    buttonRight.addEventListener("click", () => {
        sidebarCalendarOffset++;
        loadSidebarCalendar();
    })
}