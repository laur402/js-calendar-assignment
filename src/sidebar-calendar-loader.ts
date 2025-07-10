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
    const calendarModule = document.getElementsByClassName(CLASSES.Aside_CalendarModule)[0] as HTMLElement;
    const calendarModuleDateButtons = Array.from(calendarModule.getElementsByClassName(CLASSES.CalendarModule_DayCell)) as HTMLElement[];

    const firstDay: Date = getFirstDayOfMonth(new Date(currentMonth));
    const lastDay: Date = getLastDayOfMonth(new Date(currentMonth));
    const firstDayOfMonthWeek: Date = getFirstDayOfWeek(new Date(firstDay));
    const lastDayOfMonthWeek: Date = getLastDayOfWeek(new Date(lastDay));

    calendarModuleDateButtons.forEach(button => {
        button.remove();
    });
    for (let i: Date = new Date(firstDayOfMonthWeek);
         !isSameDay(i, addDays(lastDayOfMonthWeek, 1));
         i.setDate(i.getDate() + 1)) {

        const calendarButton: HTMLElement = document.createElement("button");
        calendarButton.innerText = String(i.getDate());
        calendarButton.classList.add(CLASSES.CalendarModule_DayCell, CLASSES.Button_Backgroundless, CLASSES.Button_Borderless);
        calendarButton.setAttribute(ATTRIBUTES.SidebarCalendarDate, i.getTime().toString());
        calendarButton.addEventListener("click", async () => {
            const buttonDate: number = Number(calendarButton.getAttribute(ATTRIBUTES.SidebarCalendarDate));
            setWeekOffset(weekOffsetCalc(new Date(), new Date(buttonDate)));
            await reloadWeekView();
        });

        if (toYearMonthString(i) !== toYearMonthString(currentMonth))
            calendarButton.classList.add(CLASSES.CalendarModule_DayCell_NotCurrent);

        calendarModule.appendChild(calendarButton);
    }
}

function loadSidebarCalendarDate() {
    const headerDate = document.getElementsByClassName(CLASSES.CalendarModule_Header_Date)[0] as HTMLElement;
    const currentMonth: Date = new Date();
    currentMonth.setMonth(currentMonth.getMonth() + sidebarCalendarOffset);
    headerDate.innerText = `${currentMonth.getFullYear()} ${MONTHS[currentMonth.getMonth()]}`
}

function weekOffsetCalc(baseDate: Date, shiftDate: Date){
    const difference: number = getFirstDayOfWeek(shiftDate).getTime() - getFirstDayOfWeek(baseDate).getTime();
    const weekOffset: number = difference / (7 * 24 * 60 * 60 * 1000);
    return Math.round(weekOffset);
}