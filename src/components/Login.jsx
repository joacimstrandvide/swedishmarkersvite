import { useState, useEffect } from 'react'
// Firebase
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
    const [mode, setMode] = useState('login')
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
                    setError('Email already in use.')
                    break
                case 'auth/invalid-email':
                    setError('Invalid email address.')
                    break
                case 'auth/weak-password':
                    setError('Password must be at least 6 characters long.')
                    break
                case 'auth/invalid-credential':
                    setError('Wrong email or password.')
                    break
                default:
                    setError('Something went wrong, please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Inloggad information
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
                    Sign out
                </button>
            </div>
        )
    }

    // Utloggad vy
    return (
        <div className={styles.card}>
            <h2 className={styles.title}>
                {mode === 'login' ? 'Login' : 'Create account'}
            </h2>

            {mode === 'register' && (
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            )}

            <input
                className={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className={styles.input}
                type="password"
                placeholder="Password"
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
                    ? 'Loading...'
                    : mode === 'login'
                      ? 'Login'
                      : 'Create account'}
            </button>

            <p className={styles.toggle}>
                {mode === 'login' ? (
                    <>
                        No account?{' '}
                        <span
                            onClick={() => {
                                setMode('register')
                                setError('')
                            }}
                        >
                            Create one
                        </span>
                    </>
                ) : (
                    <>
                        Already have an account?{' '}
                        <span
                            onClick={() => {
                                setMode('login')
                                setError('')
                            }}
                        >
                            Login
                        </span>
                    </>
                )}
            </p>
        </div>
    )
}
