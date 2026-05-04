import Sidebar from './Sidebar';
import Navbar  from './Navbar';
import '../styles/admin.css';

export default function AdminLayout({ title, children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Navbar title={title} />
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}