import Elysia from "elysia";
import { login, loginType, signout, signup, signupType } from "./auth";

const publicRoutes = new Elysia()
.post('/login', login, { body: loginType })
.post('/signup', signup, { body: signupType })
.post('/signout', signout)

export default publicRoutes;