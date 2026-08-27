import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** /admin altındaki her sayfayı korur; giriş yoksa /admin/giris'e yollar. */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin") && !path.startsWith("/admin/giris") && !user) {
    return NextResponse.redirect(new URL("/admin/giris", request.url));
  }
  if (path.startsWith("/admin/giris") && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
