import { useState, useEffect } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { auth } from '../firebase'
import styles from './Login.module.css'

export default function Login() {
    const [currentUser, setCurrentUser] = useState(null)
    const [mode, setMode] = useState('login') // 'login' | 'register'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user || null)
        })
        return () => unsub()
    }, [])

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try {
            if (mode === 'register') {
                if (!name.trim()) {
                    setError('Ange ett namn.')
                    setLoading(false)
                    return
                }
                const { user } = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                await updateProfile(user, { displayName: name.trim() })
            } else {
                await signInWithEmailAndPassword(auth, email, password)
            }
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('E-postadressen används redan.')
                    break
                case 'auth/invalid-email':
                    setError('Ogiltig e-postadress.')
                    break
                case 'auth/weak-password':
                    setError('Lösenordet måste vara minst 6 tecken.')
                    break
                case 'auth/invalid-credential':
                    setError('Fel e-post eller lösenord.')
                    break
                default:
                    setError('Något gick fel. Försök igen.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Inloggad vy
    if (currentUser) {
        return (
            <div className={styles.loggedIn}>
                <div className={styles.avatar}>
                    {(currentUser.displayName ||
                        currentUser.email ||
                        '?')[0].toUpperCase()}
                </div>
                <p className={styles.loggedInName}>
                    {currentUser.displayName || currentUser.email}
                </p>
                <p className={styles.loggedInEmail}>{currentUser.email}</p>
                <button
                    className={styles.logoutButton}
                    onClick={() => signOut(auth)}
                >
                    Logga ut
                </button>
            </div>
        )
    }

    // Utloggad vy
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>
                {mode === 'login' ? 'Logga in' : 'Skapa konto'}
            </h2>

            {mode === 'register' && (
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Namn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            )}

            <input
                className={styles.input}
                type="email"
                placeholder="E-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className={styles.input}
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button
                className={styles.button}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading
                    ? 'Laddar...'
                    : mode === 'login'
                      ? 'Logga in'
                      : 'Skapa konto'}
            </button>

            <p className={styles.toggle}>
                {mode === 'login' ? (
                    <>
                        Inget konto?{' '}
                        <span
                            onClick={() => {
                                setMode('register')
                                setError('')
                            }}
                        >
                            Skapa ett här
                        </span>
                    </>
                ) : (
                    <>
                        Har du redan ett konto?{' '}
                        <span
                            onClick={() => {
                                setMode('login')
                                setError('')
                            }}
                        >
                            Logga in
                        </span>
                    </>
                )}
            </p>
        </div>
    )
}
