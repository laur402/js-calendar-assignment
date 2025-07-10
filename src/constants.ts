const THREE_LETTER_MONTHS: readonly string[] = getMonthsByLocale("short");
const TIME_IN_A_DAY_MS: number = 24*60*60*1000; //ms in a day
const TIME_IN_AN_HOUR_MS: number = 60*60*1000;
const MONTHS: readonly string[] = getMonthsByLocale("long");
const THREE_LETTER_WEEK_DAYS: readonly string[] = getWeekdaysByLocale("short").map((value) => value.toUpperCase());
const LOAD_TIME: Date = new Date();

enum WeekDays {
    "Sunday" = 0,
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
}

type DateTimeFormatOptionsMonths = "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
function getMonthsByLocale(monthFormat: DateTimeFormatOptionsMonths = "numeric", locale?: string) {
    const format = new Intl.DateTimeFormat(locale, {month: monthFormat});
    return [...Array(12).keys()]
        .map((value) => format.format(new Date(2000, value, 1)));
}
type DateTimeFormatOptionsWeekdays = "long" | "short" | "narrow" | undefined;
function getWeekdaysByLocale(monthFormat: DateTimeFormatOptionsWeekdays, locale?: string) {
    const format = new Intl.DateTimeFormat(locale, {weekday: monthFormat});
    return [...Array(7).keys()]
        .map((value) => format.format(new Date().getTime() - (new Date().getDay() - value) * TIME_IN_A_DAY_MS));
}
