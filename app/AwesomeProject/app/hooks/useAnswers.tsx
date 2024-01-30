import { useEffect, useState } from "react";
import { IAnswer, IAnswerParams, getAnswer, getAnswers } from "../lib/api";

export const useAnswers = (params: Partial<IAnswerParams>) => {
    const [answers, setAnswers] = useState<IAnswer[]>([]);

    const get = (params: Partial<IAnswerParams>) => {
        getAnswers(params).then((answers) => {
            setAnswers(answers);
        });
    }

    useEffect(() => {
        get(params)
    }, [params]);

    return {answers, get};
}

export const useAnswer = (id: number) => {
    const [answer, setAnswer] = useState<IAnswer>();

    const get = (id: number) => {
        getAnswer(id).then((answer) => {
            setAnswer(answer);
        });
    }

    useEffect(() => {
        get(id)
    }, [id]);

    return {answer, get};
}