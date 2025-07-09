let sidebarCalendarOffset: number = 0;

function loadSidebarCalendar(){
    loadSidebarCalendarDateLabels();
    loadSidebarCalendarDate();
}

function loadSidebarCalendarDateLabels(){
    const currentMonth: Date = new Date();
    currentMonth.setMonth(currentMonth.getMonth() + sidebarCalendarOffset);
    const calendarModule = document.getElementsByClassName("calendar-module")[0] as HTMLElement;
    const calendarModuleDateButtons = Array.from(calendarModule.getElementsByClassName("calendar-module__day-cell")) as HTMLElement[];

    const firstDay: Date = new Date(currentMonth).getFirstDayOfMonth();
    const lastDay: Date = new Date(currentMonth).getLastDayOfMonth();
    const firstDayOfMonthWeek: Date = firstDay.getFirstDayOfWeek();
    const lastDayOfMonthWeek: Date = new Date(lastDay).getLastDayOfWeek();

    calendarModuleDateButtons.forEach(button => {
        button.remove();
    });
    for (let i: Date = new Date(firstDayOfMonthWeek);
         i.toDateString() !== lastDayOfMonthWeek.addDays(1).toDateString();
         i.setDate(i.getDate() + 1)) {

        const calendarButton: HTMLElement = document.createElement("button");
        calendarButton.innerText = String(i.getDate());
        calendarButton.classList.add("calendar-module__day-cell", "button-backgroundless", "button-borderless");
        calendarButton.setAttribute("data-sidebar-calendar-date", i.getTime().toString());
        calendarButton.addEventListener("click", async () => {
            const buttonDate: number = Number(calendarButton.getAttribute("data-sidebar-calendar-date"));
            weekOffset = weekOffsetCalc(new Date(), new Date(buttonDate));
            await reloadWeekView();
        });

        if (i.toYearMonthString() !== currentMonth.toYearMonthString())
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
    const difference: number = shiftDate.getFirstDayOfWeek().getTime() - baseDate.getFirstDayOfWeek().getTime();
    const weekOffset: number = difference / (7 * 24 * 60 * 60 * 1000);
    return Math.round(weekOffset);
}