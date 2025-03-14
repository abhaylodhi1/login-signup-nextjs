import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/lib/db';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await db.query('SELECT * FROM users WHERE email = ?', [
          credentials.email,
        ]);

        const users = result[0] as User[];

        if (!users || users.length === 0)
          throw new Error('Invalid email or password');

        const user = users[0];

        const isValidPassword = bcrypt.compareSync(
          credentials.password,
          user.password,
        );
        if (!isValidPassword) throw new Error('Invalid email or password');

        return { id: user.id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
