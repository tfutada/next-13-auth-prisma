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

        jwt: {
            // The maximum age of the NextAuth.js issued JWT in seconds.
            // Defaults to `session.maxAge`.
            maxAge: 60 * 60 * 24 * 30,
        },

        session: {
            // Choose how you want to save the user session.
            // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
            // If you use an `adapter` however, we default it to `"database"` instead.
            // You can still force a JWT session by explicitly defining `"jwt"`.
            // When using `"database"`, the session cookie will only contain a `sessionToken` value,
            // which is used to look up the session in the database.
            strategy: "database",

            // Seconds - How long until an idle session expires and is no longer valid.
            maxAge: 30 * 24 * 60 * 60, // 30 days

            // Seconds - Throttle how frequently to write to database to extend a session.
            // Use it to limit write operations. Set to 0 to always update the database.
            // Note: This option is ignored if using JSON Web Tokens
            updateAge: 24 * 60 * 60, // 24 hours

            // // The session token is usually either a random UUID or string, however if you
            // // need a more customized session token string, you can define your own generate function.
            // generateSessionToken: () => {
            //     return randomUUID?.() ?? randomBytes(32).toString("hex")
            // }
        },

        callbacks: {
            jwt: async ({token, user, account, profile, isNewUser}) => {
                // NOT CALLED!
                console.log("this won't be called as DB is used.")
                return token;
            },
            session: async ({session, token, user}) => {
                // When using database sessions, the User (user) object is passed as an argument.
                // When using JSON Web Tokens for sessions, the JWT payload (token) is provided instead.

                console.log("in session", {session, token, user});

                const getToken = await prisma.account.findFirst({
                    where: {
                        userId: user.id,
                    },
                });

                console.log("in session", getToken?.access_token);

                return {
                    ...session,
                    user: {
                        ...session.user,
                        accessToken: getToken?.access_token,
                    },

                };
            },
        }
    }
;