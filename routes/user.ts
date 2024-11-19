import Elysia from "elysia";
import { onlyUser } from "../auth/roles-auth";

const userRoutes = new Elysia()
.derive(onlyUser)


export default userRoutes;