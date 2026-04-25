import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBoard, deleteButton } from '../board/boardSlice';
import ModalShell from './ModalShell';
import ImageUploadField from './ImageUploadField';
import { deleteImageAsset } from '../../utils/boardStorage';
import {
  createUploadedImageEntry,
  isImageReferenced,
  removeImageIfUnused,
  upsertImage,
} from '../../utils/imageAssets';
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
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const hasExistingButton = board.buttons.some((btn) => btn.id === button.id);
  const currentImage = board.images?.find((image) => image.id === button.image_id) || null;

  const normalizePercent = (value, fallback) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return fallback;
    return Number(Math.min(100, Math.max(0, parsed)).toFixed(2));
  };

  const handleConfirm = async () => {
    const trimmedLabel = label.trim();
    const updatedButton = {
      ...button,
      label: trimmedLabel,
      vocalization: vocalization.trim() || trimmedLabel,
    };
    let nextImages = board.images || [];

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

    try {
      setIsSaving(true);
      setImageError('');

      if (removeImage || imageFile) {
        delete updatedButton.image_id;
        nextImages = removeImageIfUnused(board, button.image_id, button.id);

        if (currentImage?.ext_voco_asset_id && nextImages.length !== (board.images || []).length) {
          await deleteImageAsset(currentImage.ext_voco_asset_id);
        }
      }

      if (imageFile) {
        const imageEntry = await createUploadedImageEntry(imageFile, `button-${button.id}`);
        nextImages = upsertImage(nextImages, imageEntry);
        updatedButton.image_id = imageEntry.id;
      }
    } catch {
      setImageError('圖片儲存失敗，請重新選擇圖片。');
      setIsSaving(false);
      return;
    }

    const updatedButtons = hasExistingButton
      ? board.buttons.map((btn) => (btn.id === button.id ? updatedButton : btn))
      : [...board.buttons, updatedButton];

    dispatch(updateBoard({ ...board, buttons: updatedButtons, images: nextImages }));
    onClose();
  };

  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      if (currentImage?.ext_voco_asset_id && !isImageReferenced(board, button.image_id, button.id)) {
        await deleteImageAsset(currentImage.ext_voco_asset_id);
        dispatch(
          updateBoard({
            ...board,
            images: (board.images || []).filter((image) => image.id !== button.image_id),
          })
        );
      }
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
      confirmDisabled={label.trim() === '' || isSaving}
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
      <ImageUploadField
        id="edit-btn-image"
        label="按鈕圖片"
        previewLabel={label}
        image={currentImage}
        selectedFile={imageFile}
        isRemoved={removeImage}
        onFileSelect={(file) => {
          setImageFile(file);
          setRemoveImage(false);
          setImageError('');
        }}
        onRemove={() => {
          setImageFile(null);
          setRemoveImage(true);
        }}
      />
      {imageError && <p className="modal-error">{imageError}</p>}
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
