import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rutasPublicas = ["/login", "/landing", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar rutas públicas
  if (rutasPublicas.includes(pathname)) return NextResponse.next();

  // Verificar si hay sesión en la cookie
  const usuario = request.cookies.get("usuario");

  if (!usuario) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/editor", "/mis-menus", "/plantillas", "/mi-negocio", "/configuracion", "/planes", "/analiticas"],
};