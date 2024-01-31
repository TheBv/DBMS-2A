import * as schema from './../../../backend/db/schema'

const URL = "http://localhost:3000"

export type IPutResponse = {
    result: [{
        id: number
    }]
} | null

export interface IQuestionParams {
    options: string[],
    categories: typeof schema.evalCategory.enumValues,
    time_start: string,
    time_end: string
}

export type IQuestion = {
    timing_rule: string
} & Omit<typeof schema.questions.$inferSelect, 'timing_rule'>

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

export const getQuestion = async (id: number): Promise<IQuestion | null> => {
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

export const postPushQuestion = async (id: number): Promise<IPutResponse> => {
    const result = await fetch(`${URL}/postPushQuestion/` + id, {
        method: "POST"
    }).catch((err) => {
        console.log(err)
    })
    if (!result)
        return null
    return (await result.json()).result
}