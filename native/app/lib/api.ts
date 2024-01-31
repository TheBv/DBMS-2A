import Constants from 'expo-constants'
import * as schema from './../../../backend/db/schema'

export const URL = typeof Constants.expoConfig.hostUri != 'undefined' ? 
    `http://${Constants.expoConfig.hostUri?.split(":").shift().concat(":3000")}` :
     "http://localhost:3000"

export interface IPutResponse {
    result: [{
        id: number
    }]
}

export interface IQuestionParams {
    options: string[],
    categories: typeof schema.evalCategory.enumValues,
    time_start: string,
    time_end: string
}

export type IQuestion = {
    timing_rule: string
} & Omit<typeof schema.questions.$inferInsert, 'timing_rule'>

export const getQuestions = async (params?: Partial<IQuestionParams>): Promise<IQuestion[]> => {
    const url = new URLSearchParams()
    if (params?.options)
        url.append("options", params.options.join(","))
    if (params?.categories)
        url.append("categories", params.categories.join(","))
    if (params?.time_start)
        url.append("time_start", params.time_start)
    if (params?.time_end)
        url.append("time_end", params.time_end)

    const result = await fetch(`${URL}/questions?` + url.toString())
        .catch((err) => {
            console.log(err)
        })
    if (!result)
        return []
    return (await result.json()).result
}

export const getQuestion = async (id: number): Promise<IQuestion> => {
    const result = await fetch(`${URL}/question/` + id)
        .catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export const putQuestion = async (question: Omit<IQuestion, "id">): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/questions`, {
        method: "PUT",
        body: JSON.stringify(question),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export const deleteQuestion = async (id: number): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/questions/` + id, {
        method: "DELETE"
    }).catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export interface IUserParams {
    name?: string,
    categories?: typeof schema.sportCategory.enumValues,
}

export type IUser = typeof schema.users.$inferSelect

export const getUsers = async (params?: Partial<IUserParams>): Promise<IUser[]> => {
    const url = new URLSearchParams()
    if (params?.name)
        url.append("name", params.name)
    if (params?.categories)
        url.append("categories", params.categories.join(","))

    const result = await fetch(`${URL}/users?` + url.toString())
        .catch((err) => {
            console.log(err)
        })
    if (!result)
        return []
    return (await result.json()).result
}

export const getUser = async (id: number): Promise<IUser> => {
    const result = await fetch(`${URL}/users/` + id)
        .catch((err) => {
            console.log(URL)
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export const putUser = async (user: Omit<IUser, "id">): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/users`, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export const patchUser = async (id: number, user: Partial<Omit<IUser, "id">>): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/users/` + id, {
        method: "PATCH",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export const deleteUser = async (id: number): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/users/` + id, {
        method: "DELETE"
    }).catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export interface IAnswerParams {
    user_id?: number,
    question_id?: number,
    answer?: string
}

export type IAnswer = typeof schema.answers.$inferSelect

export const getAnswers = async (params?: Partial<IAnswerParams>): Promise<IAnswer[]> => {
    const url = new URLSearchParams()
    if (params?.user_id)
        url.append("user_id", params.user_id.toString())
    if (params?.question_id)
        url.append("question_id", params.question_id.toString())
    if (params?.answer)
        url.append("answer", params.answer)

    const result = await fetch(`${URL}/answers?` + url.toString())
        .catch((err) => {
            console.log(err)
        })
    if (!result)
        return []
    return (await result.json()).result
}

export const getAnswer = async (id: number): Promise<IAnswer> => {
    const result = await fetch(`${URL}/answer/` + id)
        .catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export const putAnswer = async (answer: Omit<IAnswer, "id">): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/answers`, {
        method: "PUT",
        body: JSON.stringify(answer),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}

export const deleteAnswer = async (id: number): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/answers/` + id, {
        method: "DELETE"
    }).catch((err) => {
            console.log(err)
        })
    if (!result)
        return null
    return (await result.json()).result
}