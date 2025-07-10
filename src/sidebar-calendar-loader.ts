let sidebarCalendarOffset: number = 0;
function getSidebarCalendarOffset(){
    return sidebarCalendarOffset;
}
function setSidebarCalendarOffset(setValue: number){
    sidebarCalendarOffset = setValue;
}

function loadSidebarCalendar(){
    loadSidebarCalendarDateLabels();
    loadSidebarCalendarDate();
}

function loadSidebarCalendarDateLabels(){
    const currentMonth: Date = new Date();
    currentMonth.setMonth(currentMonth.getMonth() + sidebarCalendarOffset);
    const calendarModule = document.getElementsByClassName("calendar-module")[0] as HTMLElement;
    const calendarModuleDateButtons = Array.from(calendarModule.getElementsByClassName("calendar-module__day-cell")) as HTMLElement[];

    const firstDay: Date = getFirstDayOfMonth(new Date(currentMonth));
    const lastDay: Date = getLastDayOfMonth(new Date(currentMonth));
    const firstDayOfMonthWeek: Date = getFirstDayOfWeek(new Date(firstDay));
    const lastDayOfMonthWeek: Date = getLastDayOfWeek(new Date(lastDay));

    calendarModuleDateButtons.forEach(button => {
        button.remove();
    });
    for (let i: Date = new Date(firstDayOfMonthWeek);
         i.toDateString() !== addDays(lastDayOfMonthWeek,1).toDateString();
         i.setDate(i.getDate() + 1)) {

        const calendarButton: HTMLElement = document.createElement("button");
        calendarButton.innerText = String(i.getDate());
        calendarButton.classList.add("calendar-module__day-cell", "button-backgroundless", "button-borderless");
        calendarButton.setAttribute("data-sidebar-calendar-date", i.getTime().toString());
        calendarButton.addEventListener("click", async () => {
            const buttonDate: number = Number(calendarButton.getAttribute("data-sidebar-calendar-date"));
            setWeekOffset(weekOffsetCalc(new Date(), new Date(buttonDate)));
            await reloadWeekView();
        });

        if (toYearMonthString(i) !== toYearMonthString(currentMonth))
            calendarButton.classList.add("calendar-module__day-cell-not-current");

        calendarModule.appendChild(calendarButton);
    }
}

function loadSidebarCalendarDate() {
    const headerDate = document.getElementsByClassName("calendar-module-header__date")[0] as HTMLElement;
    const currentMonth: Date = new Date();
    currentMonth.setMonth(currentMonth.getMonth() + sidebarCalendarOffset);
    headerDate.innerText = `${currentMonth.getFullYear()} ${MONTHS[currentMonth.getMonth()]}`
}

function weekOffsetCalc(baseDate: Date, shiftDate: Date){
    const difference: number = getFirstDayOfWeek(shiftDate).getTime() - getFirstDayOfWeek(baseDate).getTime();
    const weekOffset: number = difference / (7 * 24 * 60 * 60 * 1000);
    return Math.round(weekOffset);
}