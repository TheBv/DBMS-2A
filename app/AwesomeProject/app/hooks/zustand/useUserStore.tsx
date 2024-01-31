import { create } from 'zustand'
import { IUser, getUser } from '../../lib/api'
import {ExpoPushToken} from 'expo-notifications';

export interface IUserStore {
    user: IUser | null;
    token: ExpoPushToken | null;
    setToken: (token: ExpoPushToken | null) => void;
    setUser: (user: IUser | null) => void;
    getUser: (id: number) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
    user: null,
    token: null,
    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),
    getUser: async (id) => {
        const user = await getUser(id)
        set({ user })
    }
}));