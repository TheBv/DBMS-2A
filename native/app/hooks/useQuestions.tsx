import { useEffect, useState } from "react";
import { IQuestion, IQuestionParams, getQuestion, getQuestions } from "../lib/api";


export const useQuestions = (params?: Partial<IQuestionParams>) => {
    const [questions, setQuestions] = useState<IQuestion[]>([]);

    const get = (params?: Partial<IQuestionParams>) => {
        getQuestions(params).then((questions) => {
            setQuestions(questions);
        });
    }

    useEffect(() => {
        get(params)
    }, [params]);

    return {questions, get};
}

export const useQuestion = (id: number) => {
    const [question, setQuestion] = useState<IQuestion>();

    const get = (id: number) => {
        getQuestion(id).then((question) => {
            setQuestion(question);
        });
    }

    useEffect(() => {
        get(id)
    }, [id]);

    return {question, get};
}