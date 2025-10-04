import { RootState } from "@redux/store/store";


// Selector to get the counter value from the state
export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthStateUsername = (state: RootState) => state.auth.username;
