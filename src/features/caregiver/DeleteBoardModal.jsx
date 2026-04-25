import { useDispatch, useSelector } from 'react-redux';
import { deleteBoard, deleteButton, updateBoard } from '../board/boardSlice';
import { goHome } from '../navigation/navigationSlice';
import ModalShell from './ModalShell';
import { deleteBoardImageAssets, deleteImageAsset } from '../../utils/boardStorage';
import { isImageReferenced } from '../../utils/imageAssets';

export default function DeleteBoardModal({ board, onClose }) {
  const dispatch = useDispatch();
  const allBoards = useSelector((state) => state.boards.byId);

  const handleConfirm = async () => {
    for (const [parentBoardId, parentBoard] of Object.entries(allBoards)) {
      for (const btn of parentBoard.buttons || []) {
        if (btn.load_board?.id === board.id) {
          const navImage = parentBoard.images?.find((image) => image.id === btn.image_id);
          if (
            navImage?.ext_voco_asset_id &&
            !isImageReferenced(parentBoard, btn.image_id, btn.id)
          ) {
            await deleteImageAsset(navImage.ext_voco_asset_id);
            dispatch(
              updateBoard({
                ...parentBoard,
                images: (parentBoard.images || []).filter((image) => image.id !== btn.image_id),
              })
            );
          }
          dispatch(deleteButton({ boardId: parentBoardId, buttonId: btn.id }));
        }
      }
    }
    await deleteBoardImageAssets(board);
    dispatch(deleteBoard(board.id));
    dispatch(goHome());
    onClose();
  };

  return (
    <ModalShell
      title="刪除頁面"
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmDisabled={false}
    >
      <p>確定要刪除「{board.name}」？此操作無法復原。</p>
    </ModalShell>
  );
}
