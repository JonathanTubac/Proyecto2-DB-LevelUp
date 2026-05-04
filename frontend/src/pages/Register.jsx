import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerRequest } from '../api/auth.api';
import '../styles/login.css';

export default function Register() {
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        confirm: '',
        telefono: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // validar que las contraseñas coincidan
        if (form.password !== form.confirm) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await registerRequest({
                nombre: form.nombre,
                email: form.email,
                password: form.password,
                telefono: form.telefono || undefined,
                id_rol: 3, // Cliente por defecto
            });

            navigate('/login', {
                state: { message: '¡Cuenta creada! Inicia sesión.' }
            });
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
                    <p>Crear una cuenta</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Nombre completo</label>
                        <input
                            name="nombre"
                            type="text"
                            placeholder="Juan García"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Correo electrónico</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="juan@gmail.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Teléfono (opcional)</label>
                        <input
                            name="telefono"
                            type="text"
                            placeholder="12345678"
                            value={form.telefono}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Mínimo 8 caracteres, una mayúscula y un número"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmar contraseña</label>
                        <input
                            name="confirm"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirm}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>

                    <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '0.85rem' }}>
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" style={{ color: 'var(--green)', textDecoration: 'none' }}>
                            Iniciar sesión
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}