import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const { t, currentLanguage } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(username, password)
      if (success) {
        navigate('/')
      } else {
        setError(t('auth.invalidCredentials'))
      }
    } catch (err) {
      setError(t('auth.invalidCredentials'))
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    { role: 'student', username: 'student', password: 'password' },
    { role: 'supervisor', username: 'supervisor', password: 'password' },
    { role: 'committee', username: 'committee', password: 'password' },
    { role: 'discussion', username: 'discussion', password: 'password' },
    { role: 'admin', username: 'admin', password: 'password' }
  ]

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setUsername(account.username)
    setPassword(account.password)
  }

  const handleForgotPassword = async () => {
    // if (!formData.email) {
    //   setError('Please enter your email address first');
    //   return;
    // }

    // try {
    //   setLoading(true);
    //   await authAPI.forgotPassword(formData.email);
    //   setSuccess('Password reset instructions sent to your email');
    // } catch (err) {
    //   setError('Failed to send password reset email');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gpms-dark to-gpms-light flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-7 space-y-6">
          {/* Logo and Title */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto 1shadow-lg">
              <img src='./logo.png' alt='Logo' />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {t('auth.loginTitle')}
            </h2>
            <p className="text-gray-600 mt-2">
              {t('messages.GPMS')}
            </p>
          </div>

          {/* Error Message */}
          {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.username')}
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 rtl:left-0 rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10 pr-4 rtl:pl-4 rtl:pr-10"
                  placeholder={t('auth.username')}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 rtl:left-0 rtl:right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-12 rtl:pl-12 rtl:pr-10"
                  placeholder={t('auth.password')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  // checked={formData.rememberMe}
                  // onChange={handleInputChange}
                  className="h-4 w-4 text-primary-dark focus:ring-primary-light border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 rtl:ml-0 rtl:mr-2 block text-sm text-gray-700">
                  {t('auth.rememberMe')}
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-gpms-dark hover:text-primary-light font-medium"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full btn-primary flex items-center justify-center border border-transparent',
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gpms-dark hover:bg-gpms-light focus:ring-2 focus:ring-gpms-light focus:ring-offset-2'
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('auth.loginButton')}
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200 hidden">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {currentLanguage === 'ar' ? 'حسابات تجريبية:' : 'Demo Accounts:'}
            </h3>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => fillDemoAccount(account)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span className="font-medium">{t(`common.${account.role}`)}</span>
                  <span className="text-gray-400 ml-2 rtl:ml-0 rtl:mr-2">
                    ({account.username} / {account.password})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/80 text-sm">
        <p>{t(`auth.copyright`) + ' © 2025 GPMS'}</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
