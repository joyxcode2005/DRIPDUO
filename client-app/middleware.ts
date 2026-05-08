import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Create an unmodified response
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        // Update the request cookies so subsequent code in this same request can see them
                        request.cookies.set(name, value)

                        // Update the response cookies so the browser gets the Set-Cookie headers
                        supabaseResponse.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // This will refresh the session if it's expired
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Define routes that require authentication
    const protectedRoutes = ['/profile', '/checkout', '/orders']
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    )

    if (isProtectedRoute && !user) {
        // Redirect unauthenticated users to the login page
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login' // Assuming your AuthPage is at /login
        return NextResponse.redirect(redirectUrl)
    }

    // Optional: Redirect authenticated users away from the login page
    if (user && request.nextUrl.pathname === '/login') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/profile'
        return NextResponse.redirect(redirectUrl)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}