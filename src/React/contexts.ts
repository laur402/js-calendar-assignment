import {Context, createContext, Dispatch, SetStateAction, useContext} from "react";

export const ModalStateContext = createContext<StateContext<boolean> | undefined>(undefined);
export const WeekViewWeekOffsetContext = createContext<StateContext<number> | undefined>(undefined);
export const SidebarCalendarMonthOffsetContext = createContext<StateContext<number> | undefined>(undefined)

export function useStateContext<T>(stateContext: Context<T>){
    const context = useContext(stateContext);
    if (context === undefined) throw new Error("Context doesn't exist");
    return context;
}
export interface StateContext<T> {
    value: T,
    setValue: Dispatch<SetStateAction<T>>
}