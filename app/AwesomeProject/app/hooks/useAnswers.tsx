import { useEffect, useState } from "react";
import { IAnswer, IAnswerParams, getAnswer, getAnswers } from "../lib/api";

export const useAnswers = (params: Partial<IAnswerParams>) => {
    const [answers, setAnswers] = useState<IAnswer[]>([]);

    useEffect(() => {
        getAnswers(params).then((answers) => {
            setAnswers(answers);
        });
    }, [params]);

    return answers;
}

export const useAnswer = (id: number) => {
    const [answer, setAnswer] = useState<IAnswer>();

    useEffect(() => {
        getAnswer(id).then((answer) => {
            setAnswer(answer);
        });
    }, [id]);

    return answer;
}