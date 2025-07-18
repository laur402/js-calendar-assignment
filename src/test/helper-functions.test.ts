import '@testing-library/jest-dom';
import {
    addDays,
    addHours,
    cycleArray,
    getDayDifference,
    getDaySpan,
    getFirstDayOfMonth,
    getFirstDayOfWeek,
    getLastDayOfMonth,
    getLastDayOfWeek,
    getNormalizedLocalDate,
    getTimePercentageOfDay,
    getTimezone,
    getWeekDifference,
    leftPad,
} from '../helper-functions';
import { WeekDays } from '../constants';

describe(leftPad, () => {
    test('number without specified size', () => {
        expect(leftPad(3)).toBe('03');
    });
    test('with specified size', () => {
        expect(leftPad(3, 5)).toBe('00003');
    });
    test('string', () => {
        expect(leftPad('pasta', 10)).toBe('00000pasta');
    });
    test('input bigger than size', () => {
        expect(leftPad(12345, 4)).toBe('12345');
    });
    test('input equal to size', () => {
        expect(leftPad(12345, 5)).toBe('12345');
    });
    test('size is negative', () => {
        expect(leftPad(12345, -1)).toBe('12345');
    });
    test('size is infinite', () => {
        expect(() => leftPad(12345, Infinity)).toThrow();
    });
});
describe('Date-outputting functions', () => {
    describe(getFirstDayOfWeek, () => {
        test('not modifying input', () => {
            const testDate = new Date('2025-07-17');
            expect(getFirstDayOfWeek(testDate)).not.toBe(testDate);
        });
        test('base functionality', () => {
            const testDate = new Date('2025-07-17');
            expect(getFirstDayOfWeek(testDate)).toEqual(new Date('2025-07-14'));
        });
        test('specify first day of the week', () => {
            const testDate = new Date('2025-07-17');
            expect(getFirstDayOfWeek(testDate, WeekDays.Sunday)).toEqual(
                new Date('2025-07-13'),
            );
        });
    });
    describe(getLastDayOfWeek, () => {
        test('not modifying input', () => {
            const testDate = new Date('2025-07-17');
            expect(getLastDayOfWeek(testDate)).not.toBe(testDate);
        });
        test('base functionality', () => {
            const testDate = new Date('2025-07-17');
            expect(getLastDayOfWeek(testDate)).toEqual(new Date('2025-07-20'));
        });
        test('specify last day of the week', () => {
            const testDate = new Date('2025-07-17');
            expect(getLastDayOfWeek(testDate, WeekDays.Saturday)).toEqual(
                new Date('2025-07-19'),
            );
        });
    });
    describe(getFirstDayOfMonth, () => {
        test('not modifying input', () => {
            const testDate = new Date('2025-07-17');
            expect(getFirstDayOfMonth(testDate)).not.toBe(testDate);
        });
    });
    describe(getLastDayOfMonth, () => {
        test('not modifying input', () => {
            const testDate = new Date('2025-07-17');
            expect(getLastDayOfMonth(testDate)).not.toBe(testDate);
        });
    });
    describe(addDays, () => {
        test('not modifying input', () => {
            const testDate = new Date('2025-07-17');
            expect(addDays(testDate, 0)).not.toBe(testDate);
        });
        test('base functionality', () => {
            const testDate = new Date('2025-07-17');
            expect(addDays(testDate, 3)).toEqual(new Date('2025-07-20'));
        });
        test('add nothing', () => {
            const testDate = new Date('2025-07-17');
            expect(addDays(testDate, 0)).toEqual(testDate);
        });
        test('add negative number (subtract)', () => {
            const testDate = new Date('2025-07-17');
            expect(addDays(testDate, -1)).toEqual(new Date('2025-07-16'));
        });
    });
    describe(addHours, () => {
        test('not modifying input', () => {
            const testDate = new Date('2025-07-17');
            expect(addHours(testDate, 0)).not.toBe(testDate);
        });
    });
    describe(getNormalizedLocalDate, () => {
        test('not modifying input', () => {
            const testDate = new Date('2025-07-17');
            expect(getNormalizedLocalDate(testDate)).not.toBe(testDate);
        });
        test('base functionality', () => {
            const testDate = new Date('2025-07-17 12:45');
            expect(getNormalizedLocalDate(testDate)).toEqual(
                new Date('2025-07-17 00:00'),
            );
        });
        test('handle right after midnight correctly', () => {
            const testDate = new Date('2025-07-17 00:00:00.001');
            expect(getNormalizedLocalDate(testDate)).toEqual(
                new Date('2025-07-17 00:00'),
            );
        });
        test('handle right before midnight correctly', () => {
            const testDate = new Date('2025-07-17 23:59:59.999');
            expect(getNormalizedLocalDate(testDate)).toEqual(
                new Date('2025-07-17 00:00'),
            );
        });
    });
});
describe(getTimezone, () => {
    test('base functionality', () => {
        const testDate = new Date();
        expect(getTimezone(testDate)).toBe(
            Number(testDate.toString().split('GMT')[1].slice(0, 3)),
        );
    });
});
describe(getDayDifference, () => {
    test('base functionality', () => {
        const testDate = new Date();
        const testDate2 = addDays(testDate, 3);
        expect(getDayDifference(testDate, testDate2)).toBe(3);
    });
    test('end date before start date', () => {
        const testDate = new Date();
        const testDate2 = addDays(testDate, -3);
        expect(getDayDifference(testDate, testDate2)).toBe(-3);
    });
    test('specify precision', () => {
        const testDate = new Date();
        const testDate2 = addHours(addDays(testDate, 3), 2);
        expect(getDayDifference(testDate, testDate2, 2)).toBe(3.08);
    });
});
describe(getDaySpan, () => {
    test('base functionality', () => {
        const testDate = new Date();
        const testDate2 = addDays(testDate, 3);
        expect(getDaySpan(testDate, testDate2)).toBe(3);
    });
    test('end date before start date', () => {
        const testDate = new Date();
        const testDate2 = addDays(testDate, -3);
        expect(getDaySpan(testDate, testDate2)).toBe(3);
    });
});
describe(getTimePercentageOfDay, () => {
    test('base functionality', () => {
        const testDate = new Date('2025-07-17 12:00');
        expect(getTimePercentageOfDay(testDate)).toBe(50);
    });
    test('start of day as 0', () => {
        const testDate = new Date('2025-07-17 00:00:00.000');
        expect(getTimePercentageOfDay(testDate)).toBe(0);
    });
    test('end of day as 100', () => {
        const testDate = new Date('2025-07-17 23:59:59.9999');
        expect(getTimePercentageOfDay(testDate)).toBe(100);
    });
    test('specify precision', () => {
        const testDate = new Date('2025-07-17 12:36:20.5643');
        expect(getTimePercentageOfDay(testDate, 2)).toBe(52.52);
    });
});
describe(cycleArray, () => {
    test('base functionality', () => {
        const testArray = ['A', 'B', 'C', 'D', 'E'];
        expect(cycleArray(testArray, 2)).toEqual(['D', 'E', 'A', 'B', 'C']);
    });
    test('negative number cycleBy input', () => {
        const testArray = ['A', 'B', 'C', 'D', 'E'];
        expect(cycleArray(testArray, -2)).toEqual(['C', 'D', 'E', 'A', 'B']);
    });
    test('cycleBy input over array size should cycle again', () => {
        const testArray = ['A', 'B', 'C', 'D', 'E'];
        expect(cycleArray(testArray, 6)).toEqual(['E', 'A', 'B', 'C', 'D']);
    });
    test('cycleBy input multiple of array length should be the same', () => {
        const testArray = ['A', 'B', 'C', 'D', 'E'];
        expect(cycleArray(testArray, testArray.length * 2)).toEqual(testArray);
    });
    test('cycleBy inputs with same remainders from array length should result in same arrays', () => {
        const testArray = ['A', 'B', 'C', 'D', 'E'];
        expect(cycleArray(testArray, testArray.length + 3)).toEqual(
            cycleArray(testArray, 2 * testArray.length + 3),
        );
    });
});
describe(getWeekDifference, () => {
    test('base functionality', () => {
        const testDate = new Date();
        const testDate2 = addDays(testDate, 7);
        expect(getWeekDifference(testDate, testDate2)).toBe(1);
    });
    test('dates in same week', () => {
        const testDate = new Date('2025-07-14');
        const testDate2 = addDays(testDate, 3);
        expect(getWeekDifference(testDate, testDate2)).toBe(0);
    });
    test('dates less than 7 days apart but in different weeks', () => {
        const testDate = new Date('2025-07-19');
        const testDate2 = addDays(testDate, 3);
        expect(getWeekDifference(testDate, testDate2)).toBe(1);
    });
    test('start date weekday-wise after end date', () => {
        const testDate = new Date('2025-07-19');
        const testDate2 = new Date('2025-07-29');
        expect(getWeekDifference(testDate, testDate2)).toBe(2);
    });
});
