import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { PrismaClient, $Enums , users } from '@prisma/client';
import { publicRoutes, adminRoutes, userRoutes } from './routes';
import { authMiddleware } from './auth/roles-auth';

export const prisma = new PrismaClient();
export type userRoles = $Enums.userRoles

const app = new Elysia()
.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
.use(swagger())
.derive(authMiddleware)
.get('/session', ({ user }) => { return { user }})
.use(publicRoutes)
.use(adminRoutes)
.use(userRoutes)
.listen(3001);

export type App = typeof app;

console.log(`Listening on ${app.server!.url}`);