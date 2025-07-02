let sidebarCalendarOffset = 0;
//const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

        const calendarCell = calendarCells[calendarCellCounter];

        calendarCell.style.display = "block";
        calendarCell.innerText = i.getDate();
        calendarCell.setAttribute("data-sidebar-calendar-date", i.getTime().toString());
        calendarCell.addEventListener("click", () => {
            const buttonDate = Number(calendarCell.getAttribute("data-sidebar-calendar-date"));
            weekOffset = weekOffsetCalc(new Date(), buttonDate);
            loadWeekView();
        });

        if (i.toYearMonthString() === currentMonth.toYearMonthString())
            calendarCell.classList.remove("calendar-modal__day-cell-not-current");
        else calendarCell.classList.add("calendar-modal__day-cell-not-current");

        calendarCellCounter++;
    }
    while (calendarCellCounter < calendarCells.length) {
        calendarCells[calendarCellCounter].style.display = "none";
        calendarCells[calendarCellCounter].innerText = "";
        calendarCellCounter++;
    }
}

function loadSidebarCalendarDate() {
    const headerDate = document.getElementsByClassName("calendar-modal-header__date")[0];
    const currentMonth = new Date();
    currentMonth.setMonth(currentMonth.getMonth() + sidebarCalendarOffset);
    headerDate.innerText = `${currentMonth.getFullYear()} ${months[currentMonth.getMonth()]}`
}

function weekOffsetCalc(baseDate, shiftDate){
    const difference = new Date(shiftDate).getFirstDayOfWeek().getTime() - new Date(baseDate).getFirstDayOfWeek().getTime();
    const weekOffset = difference / (7 * 24 * 60 * 60 * 1000);
    return Math.round(weekOffset);
}