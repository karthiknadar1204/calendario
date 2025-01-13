// Warning, not a good implementation in terms of reliability.
// Don't use it in production.

import Google from "next-auth/providers/google";
import NextAuth, { type Session } from "next-auth";

export interface EnrichedSession extends Session {
  accessToken: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          access_token: account.access_token,
        };
      }

      return { ...token, error: "Error fetching access token" };
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: String(token.access_token),
      } satisfies EnrichedSession;
    },
  },
});
