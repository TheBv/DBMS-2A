import { integer, pgEnum, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const evalCategory = pgEnum('eval_category', ['physiology', 'psychology', 'training', 'performance', 'social', 'cognition']);

export const sportCategory = pgEnum('sport_category', ['soccer', 'basketball', 'tennis', 'volleyball', 'handball', 'rugby', 'hockey', 'baseball', 'american_football', 'badminton', 'table_tennis']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }),
    email: varchar('email', { length: 256 }),
    password: varchar('password', { length: 256 }),
    categories: sportCategory('categories').array(),
    token: varchar('token', { length: 32 }),
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
    sport_categories: sportCategory('sport_category').array(),
    timing_rule: timestamp('timing_rule', { withTimezone: false }),
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