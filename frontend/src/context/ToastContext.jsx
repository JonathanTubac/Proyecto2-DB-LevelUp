import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
    success: <CheckCircle2 size={18} />,
    error:   <XCircle size={18} />,
    info:    <Info size={18} />,
};

const LEAVE_MS = 280;

function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null;
    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}${t.leaving ? ' toast-leaving' : ''}`}>
                    <span className="toast-icon">{ICONS[t.type]}</span>
                    <span className="toast-msg">{t.message}</span>
                    <button className="toast-close" onClick={() => onRemove(t.id)}>
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, LEAVE_MS);
    }, []);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => remove(id), 3500);
    }, [remove]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={remove} />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
