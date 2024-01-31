import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './../db/schema';
import Fastify from 'fastify';
import { RouteParameters } from 'express-serve-static-core';
import { arrayContains, arrayOverlaps, eq } from 'drizzle-orm';
import cors from '@fastify/cors';
import * as bcrypt from 'bcrypt';

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
                    query.name ? like(user.name, `%${query.name}%`) : undefined)
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
    db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, Number(req.params.id)) }).then((result) => {
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
    time_start: string,
    time_end: string
}

fastify.get<{ Querystring: IQuestionParams }>('/questions', (req, res) => {
    const query = req.query
    db.query.questions.findMany({
        where:
            (question, { and, lte, gte }) =>
                and(query.categories ? arrayContains(question.categories, query.categories) : undefined,
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
        timing_rule: new Date(req.body.timing_rule)
    }).returning({ id: schema.questions.id }).execute().then((result) => {
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
                    query.timestamp ? eq(answer.timestamp, query.timestamp) : undefined)
    }).then((result) => {
        res.send(wrapResult(result))
    }).catch((err) => {
        res.status(500).send(err)
    })
})

fastify.put<{ Body: typeof schema.answers.$inferInsert }>('/answers', (req, res) => {
    db.insert(schema.answers).values({
        user_id: req.body.user_id,
        question_id: req.body.question_id,
        answer: req.body.answer,
        timestamp: req.body.timestamp
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

async function start() {
    try {
        await fastify.register(cors)
        await fastify.listen({ port: 3000, host: '0.0.0.0' })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()