import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const evalCategory = pgEnum('eval_category', ['physiology', 'psychology', 'training', 'performance', 'social', 'cognition']);

export const sportCategory = pgEnum('sport_category', ['soccer', 'basketball', 'tennis', 'volleyball', 'handball', 'rugby', 'hockey', 'baseball', 'american_football', 'badminton', 'table_tennis']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    categories: sportCategory('categories').array(),
  }, (users) => {
    return {
      nameIndex: uniqueIndex('name_idx').on(users.name),
    }
  });

export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 256 }),
    description: varchar('description', { length: 1024 }),
    categories: evalCategory('categories').array(),
    options: varchar('options', { length: 1024 }).array(),
    timing_rule: varchar('timing_rule', { length: 256 }),
}, (question) => {
    return {
        titleIndex: uniqueIndex('title_idx').on(question.title),
    }
});

export const answers = pgTable('answers', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.id),
    question_id: integer('question_id').notNull().references(() => questions.id),
    answer: varchar('answer', { length: 1024 }),
    timestamp: integer('timestamp')
}, (answer) => {
    return {
        userQuestionIndex: uniqueIndex('user_question_idx').on(answer.user_id, answer.question_id),
    }
}); 