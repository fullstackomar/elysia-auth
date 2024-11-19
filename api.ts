import { treaty } from "@elysiajs/eden";
import { App } from './main'

const server = process.env.SERVER as string;

export const api = treaty<App>(server);