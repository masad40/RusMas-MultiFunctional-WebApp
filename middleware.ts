import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  // Matches /admin and all sub-paths, but NOT /admin/login
  matcher: ["/admin", "/admin/((?!login).*)"],
};
