import { prisma } from '@/lib/db/clients';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import DiscordProvider from 'next-auth/providers/discord';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // CredentialsProvider({
    //   name: 'Sign In',
    //   credentials: {
    //     email: {
    //       label: 'Email',
    //       type: 'email',
    //       placeholder: 'email@email.com',
    //     },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials) {
    //     const user = { id: '1', name: 'Jenny', email: 'test@test.com' };
    //     return user;
    //   },
    // }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
};

// export const authOptions = {
//   // adapter: PrismaAdapter(prisma),
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),
//   ],
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
export default NextAuth(authOptions);
