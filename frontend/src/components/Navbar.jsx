export default function Navbar({ title }) {
    const today = new Date().toLocaleDateString('es-GT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="admin-navbar">
            <h2 className="navbar-title">{title}</h2>
            <div className="navbar-right">
                <span className="navbar-date">{today}</span>
            </div>
        </header>
    );
}