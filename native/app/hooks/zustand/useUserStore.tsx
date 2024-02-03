import { create } from 'zustand'
import { IUser, getUser } from '../../lib/api'
import { ExpoPushToken } from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IUserStore {
    user: IUser | null;
    token: ExpoPushToken | null;
    setToken: (token: ExpoPushToken | null) => void;
    setUser: (user: IUser | null) => Promise<void>;
    getUser: (id: number) => Promise<IUser>;
    getStoredUser: () => Promise<IUser | null>;
}

export const useUserStore = create<IUserStore>((set, get) => ({
    user: null,
    token: null,
    setToken: (token) => set({ token }),
    setUser: async (user) => {
        await AsyncStorage.setItem('user', JSON.stringify(user))
        set({ user })
    },
    getStoredUser: async () => {
        const value = await AsyncStorage.getItem('user')
        if (value !== null) {
            const user = JSON.parse(value) as IUser | null
            set({ user })
            return user
        }
        return null
    },
    getUser: async (id) => {
        const value = await AsyncStorage.getItem('user')
        if (value !== null) {
            const user = JSON.parse(value) as IUser | null
            if (user && user.id == id) {
                await get().setUser(user)
                return user
            }
        }
        // If the stored user is different from the one requested, fetch it from the API
        const user = await getUser(id)
        get().setUser(user)
        return user
    },
}));