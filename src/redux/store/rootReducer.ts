import { combineReducers } from "redux";
import authReducer from '@redux/features/auth/slice';

const rootReducers = combineReducers({
    auth: authReducer,
});

export default rootReducers;
