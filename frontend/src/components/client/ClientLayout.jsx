import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ClientNavbar from './ClientNavbar';
import CartDrawer from './CartDrawer';
import { getMyWallet } from '../../api/client.api';
import '../../styles/client.css';

export default function ClientLayout({ children }) {
    const { pathname } = useLocation();
    const [cartOpen, setCartOpen] = useState(false);
    const [balance, setBalance] = useState(0);

    const fetchBalance = async () => {
        try {
            const res = await getMyWallet();
            setBalance(res.data?.monto ?? 0);
        } catch (err) {
            return err
        }
    };

    useEffect(() => { fetchBalance(); }, []);

    return (
        <div className="client-layout">
            <ClientNavbar onCartOpen={() => setCartOpen(true)} />

            <div className="client-content" key={pathname}>
                {children}
            </div>

            {cartOpen && (
                <CartDrawer
                    onClose={() => setCartOpen(false)}
                    walletBalance={balance}
                    onPurchaseSuccess={() => {
                        fetchBalance();
                        setCartOpen(false);
                    }}
                />
            )}
        </div>
    );
}