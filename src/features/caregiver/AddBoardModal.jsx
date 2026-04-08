import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addBoard } from '../board/boardSlice';
import { navigateTo } from '../navigation/navigationSlice';
import ModalShell from './ModalShell';

export default function AddBoardModal({ onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  const handleConfirm = () => {
    const trimmedName = name.trim();
    const newId = `board-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newBoard = {
      format: 'open-board-0.1',
      id: newId,
      locale: 'zh-TW',
      name: trimmedName,
      ext_voco_display_type: 'grid',
      buttons: [],
      grid: {
        rows: 2,
        columns: 3,
        order: [
          [null, null, null],
          [null, null, null],
        ],
      },
      images: [],
      sounds: [],
    };

    dispatch(addBoard(newBoard));
    dispatch(navigateTo(newId));
    onClose();
  };

  return (
    <ModalShell
      title="新增頁面"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={name.trim() === ''}
    >
      <div className="modal-field">
        <label htmlFor="add-board-name">頁面名稱</label>
        <input
          id="add-board-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
    </ModalShell>
  );
}
