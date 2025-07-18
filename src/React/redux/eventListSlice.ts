import { CalendarEvent } from '../../event-storage';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

type ReduxCalendarEvent = {
    [K in keyof CalendarEvent]: string;
};
export interface ReduxEventList {
    value: ReduxCalendarEvent[];
}
export interface EventList {
    value: CalendarEvent[];
}
const initialState: ReduxEventList = {
    value: [],
};
const eventListSlice = createSlice({
    name: 'eventList',
    initialState: initialState,
    reducers: {
        eventListSetList: {
            reducer: (state, action: PayloadAction<ReduxCalendarEvent[]>) => {
                state.value = action.payload;
            },
            prepare: (events: CalendarEvent[]) => {
                const newEvents = events.map(event =>
                    calendarEventToReduxCalendarEvent(event),
                );
                return {
                    payload: newEvents,
                };
            },
        },
        eventListAdd: {
            reducer: (state, action: PayloadAction<ReduxCalendarEvent>) => {
                state.value.push(action.payload);
            },
            prepare: (event: CalendarEvent) => {
                return {
                    payload: calendarEventToReduxCalendarEvent(event),
                };
            },
        },
        eventListRemoveByID: (state, action: PayloadAction<string>) => {
            const index = state.value.findIndex(
                event => event.eventId === action.payload,
            );
            state.value.splice(index, 1);
        },
        eventListModify: {
            reducer: (state, action: PayloadAction<ReduxCalendarEvent>) => {
                const index = state.value.findIndex(
                    event => event.eventId === action.payload.eventId,
                );
                state.value[index] = action.payload;
            },
            prepare: (event: CalendarEvent) => {
                return {
                    payload: calendarEventToReduxCalendarEvent(event),
                };
            },
        },
    },
});

const getReduxCalendarEvents = (state: RootState) => state.eventList.value;
export const getCalendarEvents = createSelector(
    getReduxCalendarEvents,
    reduxEvents => {
        return {
            value: reduxEvents.map(event =>
                reduxCalendarEventToCalendarEvent(event),
            ),
        };
    },
);
export const {
    eventListSetList,
    eventListAdd,
    eventListRemoveByID,
    eventListModify,
} = eventListSlice.actions;
export default eventListSlice.reducer;

function calendarEventToReduxCalendarEvent(
    event: CalendarEvent,
): ReduxCalendarEvent {
    return {
        ...event,
        eventStart: event.eventStart.getTime().toString(),
        eventEnd: event.eventEnd.getTime().toString(),
    };
}
function reduxCalendarEventToCalendarEvent(
    event: ReduxCalendarEvent,
): CalendarEvent {
    return {
        ...event,
        eventStart: new Date(Number(event.eventStart)),
        eventEnd: new Date(Number(event.eventEnd)),
    };
}
