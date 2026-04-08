import './ModalShell.css';

export default function ModalShell({ title, children, onConfirm, onClose, confirmDisabled }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-card">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>
            取消
          </button>
          <button
            className="modal-btn modal-btn--confirm"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
}
