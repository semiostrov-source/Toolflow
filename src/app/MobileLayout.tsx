import { Outlet } from 'react-router-dom'
import { useAuth, type User } from '../features/auth'
import { BottomNavigation } from '../shared/ui/BottomNavigation'

function getUserInitials(user: User | null): string {
  if (!user) return '?'
  const first = user.first_name?.trim()
  const last = user.last_name?.trim()
  if (first && last) {
    return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
  }
  const login = user.login?.trim() ?? ''
  if (login.length >= 2) return login.slice(0, 2).toUpperCase()
  if (login.length === 1) return login.toUpperCase()
  return '?'
}

export function MobileLayout() {
  const { user } = useAuth()
  const initials = getUserInitials(user)

  const avatarLabel =
    user &&
    ([user.first_name, user.last_name].filter(Boolean).join(' ').trim() || user.login)

  return (
    <div className="mobile-app flex min-h-screen justify-center bg-gray-100 text-gray-900">
      <div className="mobile-container flex w-full max-w-[430px] min-h-screen flex-col bg-gray-100 shadow">
        <header
          className="mobile-header sticky top-0 z-50 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3"
          role="banner"
        >
          <div className="flex min-w-0 items-center gap-2 text-gray-900">
            <span className="inline-flex shrink-0 text-indigo-600" aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159-.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
            </span>
            <span className="truncate font-bold uppercase tracking-widest text-gray-900">
              TOOLFLOW
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              aria-label="Уведомления"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.082A2.453 2.453 0 0018 14.164V11a6.002 6.002 0 00-4-5.659V4.5a2.25 2.25 0 10-4.5 0v.841C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17.5h5m7 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-800"
              aria-label={avatarLabel || 'Пользователь'}
            >
              {initials}
            </div>
          </div>
        </header>
        <main className="mobile-main flex min-h-0 flex-1 flex-col overflow-y-auto bg-gray-100 pb-[calc(72px+env(safe-area-inset-bottom,0px))]">
          <Outlet />
        </main>
        <BottomNavigation />
      </div>
    </div>
  )
}
