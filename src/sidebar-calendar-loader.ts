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

function createSidebarCalendarButton(date: Date, currentMonth: Date) {
    const calendarButton: HTMLElement = document.createElement("button");
    calendarButton.innerText = String(date.getDate());
    calendarButton.classList.add(CLASSES.CalendarModule_DayCell, CLASSES.Button_Backgroundless, CLASSES.Button_Borderless);
    if (toYearMonthString(date) !== toYearMonthString(currentMonth))
        calendarButton.classList.add(CLASSES.CalendarModule_DayCell_NotCurrent);

    calendarButton.setAttribute(ATTRIBUTES.SidebarCalendarDate, date.getTime().toString());

    calendarButton.addEventListener("click", async () => {
        const buttonDate: number = Number(calendarButton.getAttribute(ATTRIBUTES.SidebarCalendarDate));
        setWeekOffset(weekOffsetCalc(new Date(), new Date(buttonDate)));
        await reloadWeekView();
    });
    return calendarButton;
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
         i.getTime() < addDays(lastDayOfMonthWeek, 1).getTime();
         i.setDate(i.getDate() + 1))
    {
        const calendarButton = createSidebarCalendarButton(i, currentMonth);
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
    const weekOffset: number = difference / TIME_IN_A_WEEK_MS;
    return Math.round(weekOffset);
}