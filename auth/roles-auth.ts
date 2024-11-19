import { Context } from "elysia";
import { prisma } from "../main";

export const authMiddleware = async (context: Context) => {
  const sessionToken = context.cookie.session?.value
  console.log(context.cookie)
  if (!sessionToken) {
    return { user: null }
  }

  const session = await prisma.sessions.findUnique({
    where: { token: sessionToken },
    include: { user: true }
  })
  
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.sessions.delete({ where: { id: session.id } })
    }
    return { user: null }
  }

  const { password:_ , ...safeUser } = session.user
  return { user: safeUser }
}

export const onlyAdmin = async (context: Context) => {
  const admin = await authMiddleware(context);
  const user = admin.user;

  if(user?.role !== 'admin') throw new Error("You Cannot use This Route!")
  return { user: user }
}

export const onlyUser = async (context: Context) => {
  const admin = await authMiddleware(context);
  const user = admin.user;

  if(user?.role !== 'user') throw new Error("You Cannot use This Route!")
  return { user: user }
}