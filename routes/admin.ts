import Elysia from "elysia";
import { onlyAdmin } from "../auth/roles-auth";

const adminRoutes = new Elysia()
.derive(onlyAdmin)


export default adminRoutes;