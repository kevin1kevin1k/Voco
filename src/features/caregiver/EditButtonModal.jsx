import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBoard, deleteButton } from '../board/boardSlice';
import ModalShell from './ModalShell';
import './EditButtonModal.css';

export default function EditButtonModal({ button, board, onClose }) {
  const dispatch = useDispatch();
  const [label, setLabel] = useState(button.label);
  const [vocalization, setVocalization] = useState(button.vocalization || button.label);
  const [hotspotX, setHotspotX] = useState(button.ext_voco_hotspot?.x ?? '');
  const [hotspotY, setHotspotY] = useState(button.ext_voco_hotspot?.y ?? '');
  const [hotspotWidth, setHotspotWidth] = useState(button.ext_voco_hotspot?.width ?? '');
  const [hotspotHeight, setHotspotHeight] = useState(button.ext_voco_hotspot?.height ?? '');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const hasExistingButton = board.buttons.some((btn) => btn.id === button.id);

  const normalizePercent = (value, fallback) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return fallback;
    return Number(Math.min(100, Math.max(0, parsed)).toFixed(2));
  };

  const handleConfirm = () => {
    const trimmedLabel = label.trim();
    const updatedButton = {
      ...button,
      label: trimmedLabel,
      vocalization: vocalization.trim() || trimmedLabel,
    };

    if (button.ext_voco_hotspot) {
      updatedButton.ext_voco_hotspot = {
        ...button.ext_voco_hotspot,
        x: normalizePercent(hotspotX, button.ext_voco_hotspot.x),
        y: normalizePercent(hotspotY, button.ext_voco_hotspot.y),
        width: normalizePercent(hotspotWidth, button.ext_voco_hotspot.width),
        height: normalizePercent(hotspotHeight, button.ext_voco_hotspot.height),
        shape: 'rectangle',
      };
    }

    const updatedButtons = hasExistingButton
      ? board.buttons.map((btn) => (btn.id === button.id ? updatedButton : btn))
      : [...board.buttons, updatedButton];

    dispatch(updateBoard({ ...board, buttons: updatedButtons }));
    onClose();
  };

  const handleDeleteClick = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      dispatch(deleteButton({ boardId: board.id, buttonId: button.id }));
      onClose();
    }
  };

  const handleClose = () => {
    setConfirmDelete(false);
    onClose();
  };

  return (
    <ModalShell
      title="編輯按鈕"
      onConfirm={handleConfirm}
      onClose={handleClose}
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
      {button.ext_voco_hotspot && (
        <>
          <div className="modal-field">
            <label htmlFor="edit-btn-hotspot-x">區域 X (%)</label>
            <input
              id="edit-btn-hotspot-x"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={hotspotX}
              onChange={(e) => setHotspotX(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="edit-btn-hotspot-y">區域 Y (%)</label>
            <input
              id="edit-btn-hotspot-y"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={hotspotY}
              onChange={(e) => setHotspotY(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="edit-btn-hotspot-width">區域寬度 (%)</label>
            <input
              id="edit-btn-hotspot-width"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={hotspotWidth}
              onChange={(e) => setHotspotWidth(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label htmlFor="edit-btn-hotspot-height">區域高度 (%)</label>
            <input
              id="edit-btn-hotspot-height"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={hotspotHeight}
              onChange={(e) => setHotspotHeight(e.target.value)}
            />
          </div>
        </>
      )}
      {hasExistingButton && (
        <div className="edit-btn-delete-row">
          <button className={`btn-delete${confirmDelete ? ' btn-delete--confirm' : ''}`} onClick={handleDeleteClick}>
            {confirmDelete ? '確認刪除？' : '刪除'}
          </button>
        </div>
      )}
    </ModalShell>
  );
}
