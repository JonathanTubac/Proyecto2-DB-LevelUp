import { useState, useEffect } from 'react';
import ClientLayout from '../../components/client/ClientLayout';
import { getMyWallet, rechargeWallet } from '../../api/client.api';
import { useAuth } from '../../hooks/useAuth';

export default function Profile() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [recharging, setRecharging] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetchWallet = async () => {
        try {
            const res = await getMyWallet();
            setWallet(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWallet(); }, []);

    const handleRecharge = async (e) => {
        e.preventDefault();
        setRecharging(true);
        setError('');
        setSuccess('');

        try {
            await rechargeWallet(parseFloat(amount));
            setSuccess(`¡Recarga de Q${amount} exitosa!`);
            setAmount('');
            fetchWallet();
        } catch (err) {
            setError(err.message);
        } finally {
            setRecharging(false);
        }
    };

    const quickAmounts = [100, 250, 500, 1000];

    return (
        <ClientLayout>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 700 }}>
                Mi perfil
            </h2>

            <div className="profile-grid">

                {/* info personal */}
                <div className="profile-card">
                    <h3>Información personal</h3>

                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        {[
                            ['Nombre', user?.name],
                            ['Correo', user?.email],
                            ['Rol', user?.rol],
                        ].map(([label, value]) => (
                            <div key={label} className="profile-info-item">
                                <span>{label}</span>
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* billetera */}
                <div className="profile-card">
                    <h3>💳 Mi billetera</h3>

                    {loading ? (
                        <div className="empty-state">Cargando...</div>
                    ) : (
                        <>
                            <div className="wallet-balance">
                                <p>Saldo disponible</p>
                                <h2>Q{parseFloat(wallet?.monto ?? 0).toFixed(2)}</h2>
                            </div>

                            {success && <div className="success-message" style={{ marginBottom: '1rem' }}>{success}</div>}
                            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

                            {/* montos rápidos */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                {quickAmounts.map(q => (
                                    <button
                                        key={q}
                                        className="filter-btn"
                                        onClick={() => setAmount(String(q))}
                                    >
                                        Q{q}
                                    </button>
                                ))}
                            </div>

                            <form className="recharge-form" onSubmit={handleRecharge}>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    max="10000"
                                    placeholder="Monto a recargar"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={recharging || !amount}
                                >
                                    {recharging ? '...' : 'Recargar'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}