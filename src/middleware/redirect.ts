// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (url.pathname === '/class' && url.searchParams.has('class') && url.searchParams.has('term')) {
    const classCode = url.searchParams.get('class')
    const term = url.searchParams.get('term')

    // Parse the class code and term
    const [department, courseNumber] = classCode?.split(' ') ?? []
    const [semester, year] = term?.split(' ') ?? []

    // Construct the new URL
    const newPath = `/${year}/${semester.toLowerCase()}/${department}/${courseNumber}`

    // Redirect to the new URL
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/class',
}