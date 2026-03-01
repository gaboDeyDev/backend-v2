// import {
//     integer,
//     json,
//     pgTable,
//     serial,
//     timestamp,
//     varchar
// } from 'drizzle-orm/pg-core';

// export const logs = pgTable('logs', {
//     id: serial('id').primaryKey(),
//     ip: varchar('ip').notNull(),
//     path: varchar('path').notNull(),
//     userAgent: varchar('user_agent').notNull(),
//     user: varchar('user').notNull(),
//     request: json('request').notNull(),
//     requestType: varchar('request_type'),
//     status: integer('status').notNull(),
//     response: json('response').notNull(),
//     createdAt: timestamp('created_at').defaultNow().notNull(),
// });
