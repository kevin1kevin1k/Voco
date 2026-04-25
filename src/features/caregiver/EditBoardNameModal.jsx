import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBoard } from '../board/boardSlice';
import ModalShell from './ModalShell';
import ImageUploadField from './ImageUploadField';
import { deleteImageAsset } from '../../utils/boardStorage';
import {
  createUploadedImageEntry,
  removeImageIfUnused,
  upsertImage,
} from '../../utils/imageAssets';

export default function EditBoardNameModal({ board, onClose }) {
  const dispatch = useDispatch();
  const rootBoard = useSelector((state) => state.boards.byId.root);
  const [name, setName] = useState(board.name);
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navButton = rootBoard?.buttons?.find((button) => button.load_board?.id === board.id);
  const navImage = rootBoard?.images?.find((image) => image.id === navButton?.image_id) || null;
  const canEditEntryImage = board.id !== 'root' && Boolean(navButton);

  const handleConfirm = async () => {
    const trimmedName = name.trim();
    let nextRootBoard = null;

    if (canEditEntryImage) {
      let nextRootImages = rootBoard.images || [];
      const updatedNavButton = {
        ...navButton,
        label: trimmedName,
        vocalization: trimmedName,
      };

      try {
        setIsSaving(true);
        setImageError('');

        if (removeImage || imageFile) {
          delete updatedNavButton.image_id;
          nextRootImages = removeImageIfUnused(rootBoard, navButton.image_id, navButton.id);

          if (navImage?.ext_voco_asset_id && nextRootImages.length !== (rootBoard.images || []).length) {
            await deleteImageAsset(navImage.ext_voco_asset_id);
          }
        }

        if (imageFile) {
          const imageEntry = await createUploadedImageEntry(imageFile, `page-${board.id}`);
          nextRootImages = upsertImage(nextRootImages, imageEntry);
          updatedNavButton.image_id = imageEntry.id;
        }
      } catch {
        setImageError('圖片儲存失敗，請重新選擇圖片。');
        setIsSaving(false);
        return;
      }

      nextRootBoard = {
        ...rootBoard,
        buttons: rootBoard.buttons.map((button) =>
          button.id === navButton.id ? updatedNavButton : button
        ),
        images: nextRootImages,
      };
    }

    dispatch(updateBoard({ ...board, name: trimmedName }));
    if (nextRootBoard) {
      dispatch(updateBoard(nextRootBoard));
    }
    onClose();
  };

  return (
    <ModalShell
      title="編輯頁面名稱"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={name.trim() === '' || isSaving}
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
      {canEditEntryImage && (
        <ImageUploadField
          id="edit-board-image"
          label="頁面入口圖片"
          previewLabel={name}
          image={navImage}
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
      )}
      {imageError && <p className="modal-error">{imageError}</p>}
    </ModalShell>
  );
}
