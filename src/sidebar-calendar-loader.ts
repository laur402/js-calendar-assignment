let sidebarCalendarOffset: number = 0;

function loadSidebarCalendar(){
    loadSidebarCalendarDateLabels();
    loadSidebarCalendarDate();
}

function loadSidebarCalendarDateLabels(){
    const currentMonth = new Date();
    currentMonth.setMonth(currentMonth.getMonth() + sidebarCalendarOffset);
    const calendarCells = document.getElementsByClassName("calendar-modal__day-cell");

    const firstDay = new Date(currentMonth).getFirstDayOfMonth();
    const lastDay = new Date(currentMonth).getLastDayOfMonth();
    const firstDayOfMonthWeek = firstDay.getFirstDayOfWeek();
    const lastDayOfMonthWeek = new Date(lastDay).getLastDayOfWeek();

    let calendarCellCounter = 0;
    for (let i = new Date(firstDayOfMonthWeek);
         i.toDateString() !== lastDayOfMonthWeek.addDays(1).toDateString();
         i.setDate(i.getDate() + 1)) {

        const calendarCell: HTMLElement = calendarCells[calendarCellCounter] as HTMLElement;

        calendarCell.style.display = "block";
        calendarCell.innerText = String(i.getDate());
        calendarCell.setAttribute("data-sidebar-calendar-date", i.getTime().toString());
        calendarCell.addEventListener("click", () => {
            const buttonDate = Number(calendarCell.getAttribute("data-sidebar-calendar-date"));
            weekOffset = weekOffsetCalc(new Date(), new Date(buttonDate));
            loadWeekView();
        });

        if (i.toYearMonthString() === currentMonth.toYearMonthString())
            calendarCell.classList.remove("calendar-modal__day-cell-not-current");
        else calendarCell.classList.add("calendar-modal__day-cell-not-current");

        calendarCellCounter++;
    }
    while (calendarCellCounter < calendarCells.length) {
        const calendarCell: HTMLElement = calendarCells[calendarCellCounter] as HTMLElement;
        calendarCell.style.display = "none";
        calendarCell.innerText = "";
        calendarCellCounter++;
    }
}

function loadSidebarCalendarDate() {
    const headerDate = document.getElementsByClassName("calendar-modal-header__date")[0] as HTMLElement;
    const currentMonth = new Date();
    currentMonth.setMonth(currentMonth.getMonth() + sidebarCalendarOffset);
    headerDate.innerText = `${currentMonth.getFullYear()} ${MONTHS[currentMonth.getMonth()]}`
}

function weekOffsetCalc(baseDate: Date, shiftDate: Date){
    const difference: number = shiftDate.getFirstDayOfWeek().getTime() - baseDate.getFirstDayOfWeek().getTime();
    const weekOffset: number = difference / (7 * 24 * 60 * 60 * 1000);
    return Math.round(weekOffset);
}