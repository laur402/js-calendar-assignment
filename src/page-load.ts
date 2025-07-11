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
    const header: Element = document.getElementsByClassName(CLASSES.Header)[0];
    const todayButton: Element = header.getElementsByClassName(CLASSES.Header_Buttons_Today)[0];
    const leftButton: Element = header.getElementsByClassName(CLASSES.Header_Buttons_WeekLeft)[0];
    const rightButton: Element = header.getElementsByClassName(CLASSES.Header_Buttons_WeekRight)[0];

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
    const buttonLeft: Element = document.getElementsByClassName(CLASSES.CalendarModule_Header_Buttons_Left)[0];
    const buttonRight: Element = document.getElementsByClassName(CLASSES.CalendarModule_Header_Buttons_Right)[0];
    buttonLeft.addEventListener("click", () => {
        setSidebarCalendarOffset(getSidebarCalendarOffset()-1);
        loadSidebarCalendar();
    })
    buttonRight.addEventListener("click", () => {
        setSidebarCalendarOffset(getSidebarCalendarOffset()+1);
        loadSidebarCalendar();
    })
}