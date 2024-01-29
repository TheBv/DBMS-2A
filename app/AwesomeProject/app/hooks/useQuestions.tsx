import { useEffect, useState } from "react";
import { IQuestion, IQuestionParams, getQuestion, getQuestions } from "../lib/api";


export const useQuestions = (params?: Partial<IQuestionParams>) => {
    const [questions, setQuestions] = useState<IQuestion[]>([]);

    useEffect(() => {
        getQuestions(params).then((questions) => {
            setQuestions(questions);
        });
    }, [params]);

    return questions;
}

export const useQuestion = (id: number) => {
    const [question, setQuestion] = useState<IQuestion>();

    useEffect(() => {
        getQuestion(id).then((question) => {
            setQuestion(question);
        });
    }, [id]);

    return question;
}