import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ModalInput {
    modalEventID: string,
    modalEventName: string,
    modalEventStart: string,
    modalEventEnd: string,
    modalEventDescription: string,
    isModalEventExisting: boolean
}
const initialState: ModalInput = {
    modalEventID: "",
    modalEventName: "",
    modalEventStart: "",
    modalEventEnd: "",
    modalEventDescription: "",
    isModalEventExisting: false
};
const modalInputSlice = createSlice({
    name: "modalInput",
    initialState: initialState,
    reducers: {
        modalInputModify: (state, action: PayloadAction<Partial<ModalInput>>) => {
            Object.assign(state, action.payload);
        }
    }
})
export const {modalInputModify} = modalInputSlice.actions;
export default modalInputSlice.reducer;