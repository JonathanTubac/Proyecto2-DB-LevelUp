// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // ← agrega useLocation
import { useAuth } from '../hooks/useAuth';
import { loginRequest } from '../api/auth.api';
import '../styles/login.css';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // ← para recibir el mensaje del register
    const message = location.state?.message;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await loginRequest(form);
            login(res.data);

            const { rol } = res.data.user;
            if (rol === 'Administrador') navigate('/admin');
            else if (rol === 'Empleado') navigate('/empleado');
            else navigate('/cliente');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-logo">
                    <h1>LevelUp</h1>
                    <p>Panel de administración</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    {/* mensaje de éxito del register */}
                    {message && (
                        <div style={{
                            background: 'rgba(0,212,164,0.1)',
                            border: '1px solid var(--green)',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: 'var(--green)',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="admin@levelup.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.85rem' }}>
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" style={{ color: 'var(--green)', textDecoration: 'none' }}>
                            Regístrate
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}