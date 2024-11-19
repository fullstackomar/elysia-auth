import Elysia, { Context, t } from "elysia";
import { prisma } from "../main";
import { sign , verify } from 'jsonwebtoken';

const jwt_expire = 185 * 24 * 60 * 60 * 1000 // 6 Months;

async function login(context: Context) {
    const { body , set, cookie } = context;
    const { email, password } = body as { email: string; password: string }
    
    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      set.status = 401
      return { error: 'Invalid credentials' }
    }

    const validPassword = await Bun.password.verify(password, user.password)
    if (!validPassword) {
      set.status = 401
      return { error: 'Invalid credentials' }
    }
    
    const token = sign({ userId: user.id }, process.env.JWT_SECRET as string , { expiresIn: jwt_expire });
    const expiresAt = new Date(Date.now() + jwt_expire)

    await prisma.sessions.create({
        data: {
          userId: user.id,
          token,
          expiresAt
        }
      })

    cookie.session?.set({
      value: token,
      httpOnly: true,
      maxAge: jwt_expire,
      path: '/'
  })
    return { user: { id: user.id, email: user.email, role: user.role, token } }
}

export const loginType = t.Object({
  email: t.String(),
  password: t.String(),
})

async function signup(context: Context) {
  const { body, set, cookie } = context;
  const { email, password, name } = body as { 
    email: string; 
    password: string;
    name: string;
  };

  try {
    if (!name || !email || !password) {
      set.status = 400;
      return { error: 'Email and password are required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      set.status = 400;
      return { error: 'Invalid email format' };
    }

    if (password.length < 8) {
      set.status = 400;
      return { error: 'Password must be at least 8 characters long' };
    }

    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      set.status = 409; // Conflict
      return { error: 'Email already registered' };
    }

    const hashedPassword = await Bun.password.hash(password)

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'user'
      }
    });

    const { password: _, ...safeUser } = user;
    return { 
      message: 'User created successfully',
      user: safeUser
    };

  } catch (error) {
    console.error('Signup error:', error);

    set.status = 500;
    return { error: 'Failed to create user' };
  }
}

export const signupType = t.Object({
  name: t.String(),
  email: t.String(),
  password: t.String(),
})

async function signout(context: Context) {
    const token = context.cookie.session_token?.value
    if (token) {
      await Promise.all([
        await prisma.sessions.delete({ where: { token } }),
        context.cookie.session_token?.remove()
      ])
    }
    return { success: true }
}

export { login, signup, signout }