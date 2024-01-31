import { useEffect, useState } from "react";
import { IUser, IUserParams, getUser, getUsers } from "../lib/api";


export const useUsers = (params: Partial<IUserParams>) => {
    const [users, setUsers] = useState<IUser[]>([]);

    const get = (params: Partial<IUserParams>) => { 
        getUsers(params).then((users) => {
            setUsers(users);
        });
    }

    useEffect(() => {
        get(params)
    }, [params]);

    return {users, get};
}

export const useUser = (id: number) => {
    const [user, setUser] = useState<IUser>();

    const get = (id: number) => {
        getUser(id).then((user) => {
            setUser(user);
        });
    }

    useEffect(() => {
        get(id)
    }, [id]);

    return {user, get};
}