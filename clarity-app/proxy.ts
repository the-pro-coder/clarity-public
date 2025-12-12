import { NextResponse, type NextRequest } from "next/server";
import { getUser, updateSession } from "./utils/supabase/middleware";

export default async function proxy(
  request: NextRequest,
  response: NextResponse
) {
  const protectedRoutes = ["/dashboard", "/lessons"];
  const path = new URL(request.url).pathname;
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  const {
    data: { user },
  } = await getUser(request, response);
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
