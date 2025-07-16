import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface WeekViewWeekOffset {
    value: number
}
const initialState: WeekViewWeekOffset = {
    value: 0
}
const weekViewWeekOffsetSlice = createSlice({
    name: "weekViewWeekOffset",
    initialState: initialState,
    reducers: {
        weekViewWeekOffsetIncrement: state => {
            state.value += 1;
        },
        weekViewWeekOffsetDecrement: state => {
            state.value -= 1;
        },
        weekViewWeekOffsetSet: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        }
    }
});
export const {weekViewWeekOffsetIncrement, weekViewWeekOffsetDecrement, weekViewWeekOffsetSet} = weekViewWeekOffsetSlice.actions
export default weekViewWeekOffsetSlice.reducer;