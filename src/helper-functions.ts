Date.prototype.toISOLocaleString = function (): string {
    return `${this.getFullYear()}-${(this.getMonth()+1).leftPad(2)}-${this.getDate().leftPad(2)}T${this.getHours().leftPad(2)}:${this.getMinutes().leftPad(2)}`;
}

Number.prototype.leftPad = function (size = 2): string {
    let s = String(this);
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}
Date.prototype.getFirstDayOfWeek = function (): Date {
    const firstDayOfTheWeek = new Date(this);
    while (firstDayOfTheWeek.getDay() !== 1){
        firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() - 1);
    }
    return firstDayOfTheWeek;
}
Date.prototype.getLastDayOfWeek = function (): Date {
    const lastDayOfTheWeek = new Date(this);
    while (lastDayOfTheWeek.getDay() !== 0){
        lastDayOfTheWeek.setDate(lastDayOfTheWeek.getDate() + 1);
    }
    return lastDayOfTheWeek;
}
Date.prototype.getFirstDayOfMonth = function (): Date {
    const firstDayOfTheMonth = new Date(this);
    firstDayOfTheMonth.setDate(1);
    return firstDayOfTheMonth;
}
Date.prototype.getLastDayOfMonth = function (): Date {
    const lastMonthOfTheMonth = new Date(this);
    lastMonthOfTheMonth.setMonth(lastMonthOfTheMonth.getMonth() + 1);
    lastMonthOfTheMonth.setDate(0);
    return lastMonthOfTheMonth;
}
Date.prototype.addDays = function (days: number): Date {
    const date = new Date(this);
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.toYearMonthString = function (): string {
    return `${this.getFullYear()} ${MONTHS[this.getMonth()+1]}`;
}