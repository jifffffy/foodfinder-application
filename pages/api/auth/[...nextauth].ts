import GithubProvider from "next-auth/providers/github";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { createHash } from "crypto";

const createUserId = (base: string): string => {
    return createHash("sha256").update(base).digest("hex");
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, {
        providers: [
            GithubProvider({
                clientId: process.env.GITHUB_CLIENT_ID || " ",
                clientSecret: process.env.GITHUB_CLIENT_SECRET || " ",
            }),
        ],
        callbacks: {
            async jwt({ token }) {
                if (token?.email && !token.fdlst_private_userId) {
                    token.fdlst_private_userId = createUserId(token.email);
                }
                return token;
            },
            async session({ session }) {
                if (
                    session?.user?.email &&
                    !session?.user.fdlst_private_userId
                ) {
                    session.user.fdlst_private_userId = createUserId(
                        session?.user?.email
                    );
                }
                return session;
            },
        }
    });
}