import { Context, Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { PrismaClient } from '@prisma/client';
import { betterAuthView } from './auth/auth';

export const prisma = new PrismaClient();

const app = new Elysia()
.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
.all("/api/auth/*", betterAuthView)
.get('/test' , async(context: Context) => {
    
return { nice : 'as'}

})
.listen(3001);

export type App = typeof app;

console.log(`Listening on ${app.server!.url}`);