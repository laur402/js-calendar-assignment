function leftPad<T>(input: T, size: number = 2): string{
    let s: string = String(input);
    while (s.length < size) {
        s = "0" + s;
    }
    return s;
}
function toISOLocaleString (date: Date): string {
    return `${date.getFullYear()}-${leftPad((date.getMonth()+1),2)}-${leftPad(date.getDate(),2)}T${leftPad(date.getHours(),2)}:${leftPad(date.getMinutes(),2)}`;
}
function getFirstDayOfWeek(date: Date): Date {
    const firstDayOfTheWeek: Date = new Date(date);
    while (firstDayOfTheWeek.getDay() !== 1){
        firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() - 1);
    }
    return firstDayOfTheWeek;
}
function getLastDayOfWeek(date: Date): Date {
    const lastDayOfTheWeek: Date = new Date(date);
    while (lastDayOfTheWeek.getDay() !== 0){
        lastDayOfTheWeek.setDate(lastDayOfTheWeek.getDate() + 1);
    }
    return lastDayOfTheWeek;
}
function getFirstDayOfMonth(date: Date): Date {
    const firstDayOfTheMonth: Date = new Date(date);
    firstDayOfTheMonth.setDate(1);
    return firstDayOfTheMonth;
}
function getLastDayOfMonth(date: Date): Date {
    const lastMonthOfTheMonth: Date = new Date(date);
    lastMonthOfTheMonth.setMonth(lastMonthOfTheMonth.getMonth() + 1);
    lastMonthOfTheMonth.setDate(0);
    return lastMonthOfTheMonth;
}
function addDays(dateInput: Date, days: number): Date {
    const date: Date = new Date(dateInput);
    date.setDate(date.getDate() + days);
    return date;
}
function toYearMonthString (dateInput: Date): string {
    return `${dateInput.getFullYear()} ${MONTHS[dateInput.getMonth()]}`;
}
function isSameDay(date1: Date, date2: Date): boolean {
    const date1modified = new Date(date1);
    const date2modified = new Date(date2);
    const time1 = getNormalizedLocalDate(date1modified).getTime();
    const time2 = getNormalizedLocalDate(date2modified).getTime();
    return time1 === time2;
}
function getNormalizedLocalDate(date: Date): Date {
    const mDate = new Date(date);
    // Add timezone offset, making the UTC time numerically equal to local time at UTC midnight
    mDate.setTime(mDate.getTime() + (getTimezone(mDate) * TIME_IN_AN_HOUR_MS));
    // Normalize time to midnight, the day of
    mDate.setTime(mDate.getTime() - (mDate.getTime() % TIME_IN_A_DAY_MS));
    // Remove timezone offset to go back to UTC time
    mDate.setTime(mDate.getTime() - (getTimezone(mDate) * TIME_IN_AN_HOUR_MS));
    return mDate;
}
function getTimezone(date: Date): number {
    const minutesInAnHour = 60;
    return date.getTimezoneOffset() / minutesInAnHour * -1;
    //return Number(date.toString().split("GMT")[1].slice(0, 3));
}

async function asyncTryCatch<T>(operation: () => Promise<T>, defaultValue: T, errorFunction?: () => void): Promise<T> {
    try {
        const result: T = await operation();
        return result;
    }
    catch (error) {
        //console.error(error);
        if (errorFunction) {
            errorFunction();
        }
        return defaultValue;
    }
}

class AttributeError extends Error {
    constructor (message: string) {
        super(message);
        this.name = "AttributeError";
    }
}