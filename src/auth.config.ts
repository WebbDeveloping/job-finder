import type { NextAuthConfig } from "next-auth";

const publicPaths = ["/", "/privacy", "/terms", "/login", "/signup"];

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isAuthPage =
        pathname === "/login" || pathname === "/signup";
      const isPublicApi =
        pathname.startsWith("/api/auth") || pathname === "/api/health";
      const isPublicPage = publicPaths.includes(pathname);

      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      const isProtected =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/applications") ||
        pathname.startsWith("/pipeline") ||
        pathname.startsWith("/resume") ||
        pathname.startsWith("/settings") ||
        pathname === "/api/resume/pdf";

      if (!isLoggedIn && isProtected && !isPublicApi) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
      }

      if (!isLoggedIn && !isPublicPage && !isPublicApi && !isAuthPage) {
        const loginUrl = new URL("/login", nextUrl);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
