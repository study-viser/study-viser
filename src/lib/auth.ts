<<<<<<< HEAD
import NextAuth from 'next-auth';
=======
import NextAuth, { type DefaultSession } from 'next-auth';
>>>>>>> 7b0677cda5c8430c49c3ec9dea1969ce7a05fb91
import { getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

<<<<<<< HEAD
=======
declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

>>>>>>> 7b0677cda5c8430c49c3ec9dea1969ce7a05fb91
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || typeof user.password !== 'string') return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  pages: { signIn: '/auth/signin' },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      return { ...session, user: { ...session.user, role: token.role } };
    },
  },
};

export const auth = () => getServerSession(authOptions);
export default NextAuth(authOptions);