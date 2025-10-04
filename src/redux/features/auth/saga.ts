import { takeLatest } from "redux-saga/effects";
import { username } from "./slice";

/**
 * Login saga
 * @param action  { username, password }
 */
function* login(action: any): Generator<any, void, any> {

}
//---------------End------------------//

export function* watchEditorAuthSaga() {
    yield takeLatest(username.type, login);
}  