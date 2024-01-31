import cors from '@fastify/cors';
import * as bcrypt from 'bcrypt';
import { arrayContains, arrayOverlaps, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Expo } from 'expo-server-sdk';
import { RouteParameters } from 'express-serve-static-core';
import Fastify from 'fastify';
import postgres from 'postgres';
import * as schema from './../db/schema';
import { jobs, scheduleJobs } from './scheduler';

let expo = new Expo();
const fastify = Fastify();

const queryClient = postgres("postgres://admin:password@0.0.0.0:5432/dbms");
export const db = drizzle(queryClient, { schema });


function wrapResult<T>(result: T) {
    return {
        result: result
    }
}

interface IUserParams {
    name?: string,
    categories?: typeof schema.sportCategory.enumValues
}

fastify.get<{ Querystring: IUserParams }>('/users', (req, res) => {
    const query = req.query
    db.query.users.findMany({
        where:
            (user, { and, like }) =>
                and(query.categories ? arrayOverlaps(user.categories, query.categories) : undefined,
                    query.name ? like(user.name, `%${query.name}%`) : undefined),
        columns: {
            password: false
        }
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.put<{ Body: typeof schema.users.$inferInsert }>('/users', (req, res) => {
    db.insert(schema.users).values({
        name: req.body.name,
        categories: req.body.categories,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password!, 10),
        token: req.body.token
    }).returning({ id: schema.users.id }).execute().then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.patch<{ Body: typeof schema.users.$inferInsert, Params: RouteParameters<'/users/:id'> }>('/users/:id', (req, res) => {
    db.update(schema.users).set({
        name: req.body.name,
        categories: req.body.categories,
        email: req.body.email,
        password: req.body.password ? bcrypt.hashSync(req.body.password, 10) : undefined,
        token: req.body.token
    }).where(eq(schema.users.id, Number(req.params.id))).returning({ id: schema.users.id }).execute().then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.get<{ Params: RouteParameters<'/users/:id'> }>('/users/:id', (req, res) => {
    db.query.users.findFirst({
        where: (users, { eq }) =>
            eq(users.id, Number(req.params.id)),
        columns: {
            password: false
        }
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.delete<{ Params: RouteParameters<'/users/:id'> }>('/users/:id', (req, res) => {
    db.delete(schema.users).where(eq(schema.users.id, Number(req.params.id))).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

interface IQuestionParams {
    categories: typeof schema.evalCategory.enumValues,
    sport_categories: typeof schema.sportCategory.enumValues,
    time_start: string,
    time_end: string
}

fastify.get<{ Querystring: IQuestionParams }>('/questions', (req, res) => {
    const query = req.query
    db.query.questions.findMany({
        where:
            (question, { and, lte, gte }) =>
                and(query.categories ? arrayContains(question.categories, query.categories) : undefined,
                    query.sport_categories ? arrayContains(question.sport_categories, query.sport_categories) : undefined,
                    query.time_start ? gte(question.timing_rule, new Date(query.time_start)) : undefined,
                    query.time_end ? lte(question.timing_rule, new Date(query.time_end)) : undefined),
        orderBy: schema.questions.timing_rule
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

type IQuestionBody = {
    timing_rule: number
} & Omit<typeof schema.questions.$inferInsert, 'timing_rule'>

fastify.put<{ Body: IQuestionBody }>('/questions', (req, res) => {
    db.insert(schema.questions).values({
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        sport_categories: req.body.sport_categories,
        timing_rule: new Date(req.body.timing_rule)
    }).returning({ id: schema.questions.id }).execute().then((result) => {
        scheduleJobs()
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

fastify.delete<{ Params: RouteParameters<'/questions/:id'> }>('/questions/:id', (req, res) => {
    db.delete(schema.questions).where(eq(schema.questions.id, Number(req.params.id))).then((result) => {
        res.send(wrapResult(result))
        jobs[req.params.id]?.cancel()
        delete jobs[req.params.id]
        scheduleJobs()
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
    const query = req.query
    db.query.answers.findMany({
        where:
            (answer, { and, eq }) =>
                and(query.user_id ? eq(answer.user_id, query.user_id) : undefined,
                    query.question_id ? eq(answer.question_id, query.question_id) : undefined,
                    query.timestamp ? eq(answer.timestamp, new Date(query.timestamp)) : undefined)
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})


type IAnswerBody = {
    timestamp: number
} & Omit<typeof schema.answers.$inferInsert, 'timestamp'>

fastify.put<{ Body: IAnswerBody }>('/answers', (req, res) => {
    db.insert(schema.answers).values({
        user_id: req.body.user_id,
        question_id: req.body.question_id,
        answer: req.body.answer,
        timestamp: new Date(req.body.timestamp)
    }).returning({ id: schema.answers.id }).execute().then((result) => {
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

fastify.delete<{ Params: RouteParameters<'/answers/:id'> }>('/answers/:id', (req, res) => {
    db.delete(schema.answers).where(eq(schema.answers.id, Number(req.params.id))).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.post<{ Params: RouteParameters<'/questions/:id'> }>('/postPushQuestion/:id', (req, res) => {
    db.query.questions.findFirst({ where: (questions, { eq }) => eq(questions.id, Number(req.params.id)) }).then((result) => {
        if (result && result.sport_categories) {
            db.query.users.findMany({ where: (users) => arrayOverlaps(users.categories, result.sport_categories!) }).then((users) => {
                if (users.length != 0) {
                    console.log(users.map(value => value.token!))
                    expo.sendPushNotificationsAsync([{
                        to: users.map(value => `ExponentPushToken[${value.token!}]`),
                        sound: 'default',
                        title: result.title!,
                        body: result.description!,
                        data: { question_id: result.id },
                        categoryId: "question"
                    }]).then((response) => {
                        res.status(200).send(response)
                    })
                }
                else {
                    res.status(200).send("No matching users found")
                }
            }).catch((err) => {
                res.status(500).send(err)
            })
        } else {
            res.status(500).send("Not a valid question")
        }
    })
})

export function sendPushNotification(question: typeof schema.questions.$inferSelect) {
    if (question && question.sport_categories) {
        db.query.users.findMany({ where: (users) => arrayOverlaps(users.categories, question.sport_categories!) }).then(async (users) => {
            if (users.length != 0) {
                console.log(users.map(value => value.token!))
                expo.sendPushNotificationsAsync([{
                    to: users.map(value => `ExponentPushToken[${value.token!}]`),
                    sound: 'default',
                    title: question.title!,
                    body: question.description!,
                    data: { question_id: question.id },
                    categoryId: "question"
                }])
            }
        }).catch((err) => {
            console.log(err)
        })
    }
}

async function start() {
    try {
        scheduleJobs()
        await fastify.register(cors)
        await fastify.listen({ port: 3000, host: '0.0.0.0' })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()