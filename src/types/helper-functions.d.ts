interface Date {
    toISOLocaleString(): string;
    getFirstDayOfWeek(): Date;
    getLastDayOfWeek(): Date;
    getFirstDayOfMonth(): Date;
    getLastDayOfMonth(): Date;
    addDays(days: number): Date;
    toYearMonthString(): string;
}
interface Number {
    leftPad(size: number): string;
}