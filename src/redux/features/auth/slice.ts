// store/slices/editorSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';

const editorSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        username: (state, action) => {
            state.username = action.payload;
        },
    },
});


export const {
    username
} = editorSlice.actions;
export default editorSlice.reducer;

