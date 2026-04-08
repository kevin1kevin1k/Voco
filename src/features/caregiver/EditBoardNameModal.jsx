import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBoard } from '../board/boardSlice';
import ModalShell from './ModalShell';

export default function EditBoardNameModal({ board, onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(board.name);

  const handleConfirm = () => {
    dispatch(updateBoard({ ...board, name: name.trim() }));
    onClose();
  };

  return (
    <ModalShell
      title="編輯頁面名稱"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={name.trim() === ''}
    >
      <div className="modal-field">
        <label htmlFor="edit-board-name">頁面名稱</label>
        <input
          id="edit-board-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
    </ModalShell>
  );
}
