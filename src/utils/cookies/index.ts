import Cookies from "js-cookie"

export const CookiesService = {
    get: () => {
        let dataJson = Cookies.get("USER_INFO");
        return dataJson ? JSON.parse(dataJson) : null;
    },
    set: (userInfo: any) => {
        let dataJson = JSON.stringify(userInfo);
        Cookies.set("USER_INFO", dataJson, { expires: 1 });
    },
    remove: () => {
        Cookies.remove("USER_INFO");
    }
}
