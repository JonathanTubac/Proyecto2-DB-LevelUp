import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/admin.css';

export default function AdminLayout({ title, children }) {
    const { pathname } = useLocation();

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="admin-main">
                <Navbar title={title} />
                <div className="admin-content" key={pathname}>
                    {children}
                </div>
            </main>
        </div>
    );
}