const THREE_LETTER_MONTHS: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TIME_IN_A_DAY_MS: number = 24*60*60*1000; //ms in a day
const MONTHS: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const THREE_LETTER_WEEK_DAYS: string[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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