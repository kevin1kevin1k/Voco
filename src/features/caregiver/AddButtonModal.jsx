import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBoard } from '../board/boardSlice';
import ModalShell from './ModalShell';
import ImageUploadField from './ImageUploadField';
import { createUploadedImageEntry, upsertImage } from '../../utils/imageAssets';

export default function AddButtonModal({ board, onClose }) {
  const dispatch = useDispatch();
  const [label, setLabel] = useState('');
  const [vocalization, setVocalization] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    const trimmedLabel = label.trim();
    const trimmedVoc = vocalization.trim() || trimmedLabel;
    const newId = `btn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    let nextImages = board.images || [];

    const newButton = {
      id: newId,
      label: trimmedLabel,
      vocalization: trimmedVoc,
      background_color: 'rgb(240, 240, 240)',
    };

    try {
      setIsSaving(true);
      setImageError('');

      if (imageFile) {
        const imageEntry = await createUploadedImageEntry(imageFile, `button-${newId}`);
        nextImages = upsertImage(nextImages, imageEntry);
        newButton.image_id = imageEntry.id;
      }
    } catch {
      setImageError('圖片儲存失敗，請重新選擇圖片。');
      setIsSaving(false);
      return;
    }

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

    dispatch(updateBoard({ ...board, buttons: updatedButtons, images: nextImages, grid: updatedGrid }));
    onClose();
  };

  return (
    <ModalShell
      title="新增按鈕"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={label.trim() === '' || isSaving}
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
      <ImageUploadField
        id="add-btn-image"
        label="按鈕圖片"
        previewLabel={label}
        selectedFile={imageFile}
        onFileSelect={(file) => {
          setImageFile(file);
          setImageError('');
        }}
        onRemove={() => setImageFile(null)}
      />
      {imageError && <p className="modal-error">{imageError}</p>}
    </ModalShell>
  );
}
