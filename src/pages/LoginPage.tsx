import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth'
import './LoginPage.css'

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="login-modal__title">Забыли пароль?</h2>
        <p className="login-modal__message">
          Обратитесь к администратору для сброса пароля.
        </p>
        <button className="login-modal__close" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false)

  const isAccessDenied = error === 'ACCESS_DENIED'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(loginValue, password)
      navigate('/inventory')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка входа'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1 className="login-logo__title">ToolFlow</h1>
          <p className="login-logo__subtitle">Управление инструментами</p>
        </div>

        {isAccessDenied && (
          <div className="login-error login-error--access-denied" role="alert">
            <span className="login-error__icon">⛔</span>
            <span>Доступ запрещён. Ваша учётная запись деактивирована.</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="login-input">
              Логин
            </label>
            <input
              id="login-input"
              className="login-form__input"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="login-form__field">
            <label className="login-form__label" htmlFor="password-input">
              Пароль
            </label>
            <input
              id="password-input"
              className="login-form__input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && !isAccessDenied && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`login-form__btn${isLoading ? ' login-form__btn--loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>

          <button
            type="button"
            className="login-forgot"
            onClick={() => setIsForgotModalOpen(true)}
          >
            Забыли пароль?
          </button>
        </form>
      </div>

      {isForgotModalOpen && (
        <ForgotPasswordModal onClose={() => setIsForgotModalOpen(false)} />
      )}
    </div>
  )
}
