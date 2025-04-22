import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/transactions/")) {
    if (!pathname.startsWith("/transactions/details")) {
      const txHash = pathname.replace("/transactions/", "");
      return NextResponse.redirect(new URL("/transactions/details?txhash=" + txHash, request.url));
    }
  }
}
