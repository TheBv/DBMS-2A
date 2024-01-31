import { create } from 'zustand'
import { IUser, getUser } from '../../lib/api'
import { ExpoPushToken } from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IUserStore {
    user: IUser | null;
    token: ExpoPushToken | null;
    setToken: (token: ExpoPushToken | null) => void;
    setUser: (user: IUser | null) => void;
    getUser: (id: number) => void;
}

export const useUserStore = create<IUserStore>((set, get) => ({
    user: null,
    token: null,
    setToken: (token) => set({ token }),
    setUser: async (user) => {
        await AsyncStorage.setItem('user', JSON.stringify(user))
        set({ user })
    },
    getUser: async (id) => {
        const value = await AsyncStorage.getItem('user')
        if (value !== null) {
            const user = JSON.parse(value) as IUser
            if (user.id == id) {
                get().setUser(user)
                return
            }
        }
        // If the stored user is different from the one requested, fetch it from the API
        const user = await getUser(id)
        get().setUser(user)
        
    }
}));