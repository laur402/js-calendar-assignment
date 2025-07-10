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