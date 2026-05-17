import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmModal({ title, message, confirmLabel = 'Confirmar', danger = true, onConfirm, onClose }) {
    return (
        <Modal title={title} onClose={onClose}>
            <div className="confirm-body">
                <div className={`confirm-icon ${danger ? 'confirm-icon-danger' : 'confirm-icon-info'}`}>
                    <AlertTriangle size={28} />
                </div>
                <p className="confirm-message">{message}</p>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
