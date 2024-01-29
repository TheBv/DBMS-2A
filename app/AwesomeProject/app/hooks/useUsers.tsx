import { useEffect, useState } from "react";
import { IUser, IUserParams, getUser, getUsers } from "../lib/api";


export const useUsers = (params: Partial<IUserParams>) => {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        getUsers(params).then((users) => {
            setUsers(users);
        });
    }, [params]);

    return users;
}

export const useUser = (id: number) => {
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        getUser(id).then((user) => {
            setUser(user);
        });
    }, [id]);

    return user;
}