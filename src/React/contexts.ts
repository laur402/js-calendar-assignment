/*import {Context, createContext, Dispatch, SetStateAction, useContext} from "react";
import {ModalInput} from "./Body";
import {CalendarEvent} from "../event-storage";

export const ModalStateContext = createContext<StateContext<boolean> | undefined>(undefined);
export const WeekViewWeekOffsetContext = createContext<StateContext<number> | undefined>(undefined);
export const SidebarCalendarMonthOffsetContext = createContext<StateContext<number> | undefined>(undefined);
export const ModalInputContext = createContext<StateContext<ModalInput> | undefined>(undefined);
export const EventListContext = createContext<StateContext<CalendarEvent[]> | undefined>(undefined);

export function useStateContext<T>(stateContext: Context<T>){
    const context = useContext(stateContext);
    if (context === undefined) throw new Error("Context doesn't exist");
    return context;
}
export interface StateContext<T> {
    value: T,
    setValue: Dispatch<SetStateAction<T>>
}*/