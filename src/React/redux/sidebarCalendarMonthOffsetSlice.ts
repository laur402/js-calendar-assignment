import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface SidebarCalendarMonthOffset {
    value: number
}
const initialState: SidebarCalendarMonthOffset = {
    value: 0
}
const sidebarCalendarMonthOffsetSlice = createSlice({
    name: "sidebarCalendarMonthOffset",
    initialState: initialState,
    reducers: {
        sidebarCalendarMonthOffsetIncrement: state => {
            state.value += 1;
        },
        sidebarCalendarMonthOffsetDecrement: state => {
            state.value -= 1;
        },
        sidebarCalendarMonthOffsetSet: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        }
    }
});
export const {sidebarCalendarMonthOffsetIncrement, sidebarCalendarMonthOffsetDecrement, sidebarCalendarMonthOffsetSet} = sidebarCalendarMonthOffsetSlice.actions;
export default sidebarCalendarMonthOffsetSlice.reducer;