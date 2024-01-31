import { ExpoPushToken } from "expo-notifications";

export const getInnerToken = (token: ExpoPushToken) => {
    return String(token).split("ExponentPushToken[")[1].split("]")[0]
}