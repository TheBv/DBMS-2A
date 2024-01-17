import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './../db/schema';
import Fastify from 'fastify';
import { RouteParameters } from 'express-serve-static-core';
const fastify = Fastify();

const queryClient = postgres("postgres://admin:password@0.0.0.0:5432/dbms");
const db = drizzle(queryClient, { schema });


function wrapResult<T>(result: T) {
    return {
        result: result
    }
}

interface IUserParams {
    name: string,
    categories: (typeof schema.sportCategory.enumValues)[]
}

fastify.get<{ Querystring: IUserParams }>('/users', (req, res) => {
    db.query.users.findMany({
        where:
            (user, { like, inArray }) =>
                inArray(user.categories, req.query.categories) &&
                like(user.name, `${req.query.name}%`)
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.get<{ Params: RouteParameters<'/users/:id'> }>('/users/:id', (req, res) => {
    db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, Number(req.params.id)) }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

interface IQuestionParams {
    options: string[],
    categories: (typeof schema.evalCategory.enumValues)[],
    time_start: string,
    time_end: string
}

fastify.get<{ Querystring: IQuestionParams }>('/questions', (req, res) => {
    db.query.questions.findMany({
        where:
            (question, { eq, inArray }) =>
                inArray(question.categories, req.query.categories) &&
                inArray(question.options, req.query.options as any) &&
                //TODO:
                eq(question.timing_rule, `${req.query.time_start}-${req.query.time_end}`)
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.get<{ Params: RouteParameters<'/questions/:id'> }>('/questions/:id', (req, res) => {
    db.query.questions.findFirst({ where: (questions, { eq }) => eq(questions.id, Number(req.params.id)) }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})


interface IAnswerParams {
    user_id: number,
    question_id: number,
    timestamp: number
}

fastify.get<{ Querystring: IAnswerParams }>('/answers', (req, res) => {
    db.query.answers.findMany({
        where:
            (answer, { eq }) =>
                eq(answer.user_id, req.query.user_id) &&
                eq(answer.question_id, req.query.question_id) &&
                eq(answer.timestamp, req.query.timestamp)
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.get<{ Params: RouteParameters<'/answers/:id'> }>('/answers/:id', (req, res) => {
    db.query.answers.findFirst({ where: (answers, { eq }) => eq(answers.id, Number(req.params.id)) }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})



/*
    Routes:
        * /users
        * /users/:id
        * /questions
        * /questions/:id
        * /answers
        * /answers/:id
    Params:
    - users:
        * name
        * categories
    - questions:
        * timing_rule (how do we do that? Ideally start end date)
        * options
        * categories
    - answers:
        * user_id
        * question_id
        * timestamp (start and end date)
        * 
*/

async function start() {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()