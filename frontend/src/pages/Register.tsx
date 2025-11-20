// src/pages/Register.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import PasswordInput from '../components/PasswordInput'
import { registerUser } from '../lib/auth'
import { getErrorMessage } from '../lib/errors'

export default function Register() {
  const nav = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState<string|null>(null)
  const [ok, setOk]               = useState<string|null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null); setOk(null)
    try {
      await registerUser({ firstName, lastName, email, password })
      setOk('Cuenta creada. Ahora inicia sesión.')
      setTimeout(() => nav('/login'), 800)
    } catch (e) {
      setError(getErrorMessage(e) || 'No se pudo registrar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="text-2xl font-bold">Crear cuenta</h2>
        <p className="text-sm text-gray-500">Regístrate para continuar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Nombre" name="firstName" value={firstName} onChange={e=>setFirstName(e.target.value)} />
        <FormInput label="Apellidos" name="lastName" value={lastName} onChange={e=>setLastName(e.target.value)} />
      </div>
      <FormInput label="Correo" name="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <PasswordInput label="Contraseña" name="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {/* (opcional) confirmar password */}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {ok && <p className="text-xs text-green-700">{ok}</p>}

      <button className="btn btn-primary w-full" type="submit" disabled={submitting}>
        {submitting ? 'Creando...' : 'Crear cuenta'}
      </button>

      <div className="text-sm text-center">
        ¿Ya tienes cuenta? <Link to="/login" className="text-brand-700 hover:underline">Inicia sesión</Link>
      </div>
    </form>
  )
}
