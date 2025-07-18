import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
    value: boolean;
}
const initialState: ModalState = {
    value: false,
};
const modalStateSlice = createSlice({
    name: 'modalState',
    initialState: initialState,
    reducers: {
        modalStateShow: state => {
            state.value = true;
        },
        modalStateHide: state => {
            state.value = false;
        },
    },
});
export const { modalStateShow, modalStateHide } = modalStateSlice.actions;
export default modalStateSlice.reducer;
