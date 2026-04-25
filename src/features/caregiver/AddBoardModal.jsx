import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBoard, updateBoard, selectBoardById } from '../board/boardSlice';
import { navigateTo } from '../navigation/navigationSlice';
import ModalShell from './ModalShell';
import ImageUploadField from './ImageUploadField';
import { createUploadedImageEntry, upsertImage } from '../../utils/imageAssets';

export default function AddBoardModal({ onClose }) {
  const dispatch = useDispatch();
  const rootBoard = useSelector((state) => selectBoardById(state, 'root'));
  const [name, setName] = useState('');
  const [displayType, setDisplayType] = useState('grid');
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    const trimmedName = name.trim();
    const newId = `board-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    let nextRootImages = rootBoard?.images || [];

    const newBoard = {
      format: 'open-board-0.1',
      id: newId,
      locale: 'zh-TW',
      name: trimmedName,
      ext_voco_display_type: displayType,
      buttons: [],
      images: [],
      sounds: [],
    };

    if (displayType === 'grid') {
      newBoard.grid = {
        rows: 2,
        columns: 3,
        order: [
          [null, null, null],
          [null, null, null],
        ],
      };
    } else {
      newBoard.ext_voco_background = null;
    }

    // Add a navigation button in the root board so the new page stays accessible
    const navBtnId = `btn-${newId}`;
    const navBtn = {
      id: navBtnId,
      label: trimmedName,
      vocalization: trimmedName,
      load_board: { id: newId },
      background_color: 'rgb(240, 248, 255)',
    };

    try {
      setIsSaving(true);
      setImageError('');

      if (imageFile) {
        const imageEntry = await createUploadedImageEntry(imageFile, `page-${newId}`);
        nextRootImages = upsertImage(nextRootImages, imageEntry);
        navBtn.image_id = imageEntry.id;
      }
    } catch {
      setImageError('圖片儲存失敗，請重新選擇圖片。');
      setIsSaving(false);
      return;
    }

    const oldButtons = rootBoard?.buttons || [];
    const oldOrder = rootBoard?.grid?.order || [];
    const cols = rootBoard?.grid?.columns || 3;

    // Find first null slot in last row, or append a new row
    let newOrder;
    const lastRow = oldOrder[oldOrder.length - 1] || [];
    const nullIdx = lastRow.indexOf(null);
    if (nullIdx !== -1) {
      newOrder = oldOrder.map((row, i) =>
        i === oldOrder.length - 1
          ? row.map((cell, j) => (j === nullIdx ? navBtnId : cell))
          : row
      );
    } else {
      const newRow = Array(cols).fill(null);
      newRow[0] = navBtnId;
      newOrder = [...oldOrder, newRow];
    }

    const updatedRoot = {
      ...rootBoard,
      buttons: [...oldButtons, navBtn],
      images: nextRootImages,
      grid: {
        ...rootBoard?.grid,
        rows: newOrder.length,
        order: newOrder,
      },
    };

    dispatch(addBoard(newBoard));
    dispatch(updateBoard(updatedRoot));
    dispatch(navigateTo(newId));
    onClose();
  };

  return (
    <ModalShell
      title="新增頁面"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={name.trim() === '' || isSaving}
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
      <div className="modal-field">
        <label htmlFor="add-board-display-type">版面類型</label>
        <select
          id="add-board-display-type"
          value={displayType}
          onChange={(e) => setDisplayType(e.target.value)}
        >
          <option value="grid">Grid</option>
          <option value="vsd">VSD</option>
        </select>
      </div>
      <ImageUploadField
        id="add-board-image"
        label="頁面入口圖片"
        previewLabel={name}
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
