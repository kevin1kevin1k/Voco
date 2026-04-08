import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBoard } from '../board/boardSlice';
import ModalShell from './ModalShell';

export default function EditButtonModal({ button, board, onClose }) {
  const dispatch = useDispatch();
  const [label, setLabel] = useState(button.label);
  const [vocalization, setVocalization] = useState(button.vocalization || button.label);

  const handleConfirm = () => {
    const updatedButtons = board.buttons.map((btn) =>
      btn.id === button.id ? { ...btn, label: label.trim(), vocalization: vocalization.trim() || label.trim() } : btn
    );
    dispatch(updateBoard({ ...board, buttons: updatedButtons }));
    onClose();
  };

  return (
    <ModalShell
      title="編輯按鈕"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={label.trim() === ''}
    >
      <div className="modal-field">
        <label htmlFor="edit-btn-label">按鈕文字</label>
        <input
          id="edit-btn-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
        />
      </div>
      <div className="modal-field">
        <label htmlFor="edit-btn-vocalization">語音內容（留空則同按鈕文字）</label>
        <input
          id="edit-btn-vocalization"
          type="text"
          value={vocalization}
          onChange={(e) => setVocalization(e.target.value)}
        />
      </div>
    </ModalShell>
  );
}
