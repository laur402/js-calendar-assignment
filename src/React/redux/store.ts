import { configureStore } from '@reduxjs/toolkit';
import modalStateSlice from './modalStateSlice';
import weekViewWeekOffsetSlice from './weekViewWeekOffsetSlice';
import sidebarCalendarMonthOffsetSlice from './sidebarCalendarMonthOffsetSlice';
import modalInputSlice from './modalInputSlice';
import eventListSlice from './eventListSlice';

export const store = configureStore({
    reducer: {
        modalState: modalStateSlice,
        weekViewWeekOffset: weekViewWeekOffsetSlice,
        sidebarCalendarMonthOffset: sidebarCalendarMonthOffsetSlice,
        modalInput: modalInputSlice,
        eventList: eventListSlice,
    },
});
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
