import type {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {prisma} from '@/lib/prisma';

export const options: NextAuthOptions = {
        debug: true,
        adapter: PrismaAdapter(prisma),

        providers: [
            // https://next-auth.js.org/providers/google
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                authorization: {
                    params: {
                        prompt: "consent",
                        access_type: "offline",
                        response_type: "code",
                        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly",
                    }
                }
            }),
        ],
        callbacks: {
            jwt: async ({token, user, account, profile, isNewUser}) => {
                if (user) {
                    token.user = user;
                    const u = user as any
                    token.role = u.role;
                }
                if (account) {
                    token.accessToken = account.access_token
                    token.refreshToken = account.refresh_token
                }
                return token;
            },
            session: ({session, token}) => {
                // console.log("in session", {session, token});
                token.accessToken
                return {
                    ...session,
                    user: {
                        ...session.user,
                        role: token.role,
                        accessToken: token.accessToken,
                        refreshToken: token.refreshToken,
                    },

                };
            },
        }
    }
;