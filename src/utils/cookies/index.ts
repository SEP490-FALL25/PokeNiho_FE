import Cookies from "js-cookie"

export const CookiesService = {
    get: (key: string) => {
        let dataJson = Cookies.get(key);
        return dataJson ? JSON.parse(dataJson) : null;
    },
    set: (key: string, userInfo: any) => {
        let dataJson = JSON.stringify(userInfo);
        Cookies.set(key, dataJson, { expires: 1 });
    },
    remove: (key: string) => {
        Cookies.remove(key);
    }
}
