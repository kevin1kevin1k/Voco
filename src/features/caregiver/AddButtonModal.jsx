import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBoard } from '../board/boardSlice';
import ModalShell from './ModalShell';

export default function AddButtonModal({ board, onClose }) {
  const dispatch = useDispatch();
  const [label, setLabel] = useState('');
  const [vocalization, setVocalization] = useState('');

  const handleConfirm = () => {
    const trimmedLabel = label.trim();
    const trimmedVoc = vocalization.trim() || trimmedLabel;
    const newId = `btn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newButton = {
      id: newId,
      label: trimmedLabel,
      vocalization: trimmedVoc,
      background_color: 'rgb(240, 240, 240)',
    };

    const updatedButtons = [...board.buttons, newButton];

    // Append ID to grid order: find last row with space, or add new row
    const currentOrder = board.grid?.order ? board.grid.order.map((row) => [...row]) : [];
    const columns = board.grid?.columns || 3;
    const lastRow = currentOrder[currentOrder.length - 1];

    let updatedOrder;
    if (lastRow && lastRow.filter((id) => id !== null).length < columns) {
      // Find first null slot in last row
      const newLastRow = [...lastRow];
      const nullIdx = newLastRow.indexOf(null);
      if (nullIdx !== -1) {
        newLastRow[nullIdx] = newId;
      } else {
        newLastRow.push(newId);
      }
      updatedOrder = [...currentOrder.slice(0, -1), newLastRow];
    } else {
      // Add new row
      const newRow = [newId, ...Array(columns - 1).fill(null)];
      updatedOrder = [...currentOrder, newRow];
    }

    const updatedGrid = {
      ...board.grid,
      rows: updatedOrder.length,
      order: updatedOrder,
    };

    dispatch(updateBoard({ ...board, buttons: updatedButtons, grid: updatedGrid }));
    onClose();
  };

  return (
    <ModalShell
      title="新增按鈕"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={label.trim() === ''}
    >
      <div className="modal-field">
        <label htmlFor="add-btn-label">按鈕文字</label>
        <input
          id="add-btn-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
        />
      </div>
      <div className="modal-field">
        <label htmlFor="add-btn-vocalization">語音內容（留空則同按鈕文字）</label>
        <input
          id="add-btn-vocalization"
          type="text"
          value={vocalization}
          onChange={(e) => setVocalization(e.target.value)}
        />
      </div>
    </ModalShell>
  );
}
