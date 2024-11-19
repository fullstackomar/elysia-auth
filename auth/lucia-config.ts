import { userRole } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, TimeSpan } from "lucia";
import { prisma } from "../main";

const adapter = new PrismaAdapter(prisma.session, prisma.users);

const auth = new Lucia(adapter, { 
    sessionCookie: { attributes: { secure: process.env.NODE_ENV === 'production'}} ,
    sessionExpiresIn : new TimeSpan(24, 'w'),
    getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			role: attributes.role,
		};
	}
})

declare module "lucia" {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
    role: userRole;
}

export default auth;