import { NextResponse, type NextRequest } from "next/server";
import { getUser, updateSession } from "./utils/supabase/middleware";

export async function proxy(request: NextRequest, response: NextResponse) {
  const protectedRoutes = ["/dashboard"];
  const path = new URL(request.url).pathname;
  const {
    data: { user },
  } = await getUser(request, response);
  if (protectedRoutes.includes(path) && !user) {
    return NextResponse.redirect(new URL("/authenticate", request.url));
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
