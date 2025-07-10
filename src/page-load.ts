window.onload = async () => {
    await loadMainCalendarElements();
    await loadEventModal();
    tieHeaderButtons();
    loadSidebarCalendar();
    tieSidebarCalendarHeaderButtons();
    setInterval(() => {
        removeCurrentTimeGraphic();
        loadCurrentTimeGraphic(new Date());
        }, 60*1000);
}

async function loadMainCalendarElements() {
    await loadWeekView();
    loadCurrentTimeGraphic(LOAD_TIME);
}
async function reloadMainCalendarElements() {
    await reloadWeekView();
    loadCurrentTimeGraphic(new Date());
}


function tieHeaderButtons(){
    const header: Element = document.getElementsByClassName('header')[0];
    const todayButton: Element = header.getElementsByClassName('header-buttons__today')[0];
    const leftButton: Element = header.getElementsByClassName("header-buttons__week-left")[0];
    const rightButton: Element = header.getElementsByClassName("header-buttons__week-right")[0];

    todayButton.addEventListener("click", async () => {
        setWeekOffset(0);
        setSidebarCalendarOffset(0);
        await reloadMainCalendarElements();
        loadSidebarCalendar();
    });
    leftButton.addEventListener("click", async () => {
        setWeekOffset(getWeekOffset()-1);
        await reloadMainCalendarElements();
    });
    rightButton.addEventListener("click", async () => {
        setWeekOffset(getWeekOffset()+1);
        await reloadMainCalendarElements();
    });
}
function tieSidebarCalendarHeaderButtons(){
    const buttonLeft: Element = document.getElementsByClassName("calendar-module-header-buttons__month-left")[0];
    const buttonRight: Element = document.getElementsByClassName("calendar-module-header-buttons__month-right")[0];
    buttonLeft.addEventListener("click", () => {
        setSidebarCalendarOffset(getSidebarCalendarOffset()-1);
        loadSidebarCalendar();
    })
    buttonRight.addEventListener("click", () => {
        setSidebarCalendarOffset(getSidebarCalendarOffset()+1);
        loadSidebarCalendar();
    })
}