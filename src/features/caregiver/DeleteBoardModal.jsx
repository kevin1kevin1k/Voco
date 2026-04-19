import { useDispatch, useSelector } from 'react-redux';
import { deleteBoard, deleteButton } from '../board/boardSlice';
import { goHome } from '../navigation/navigationSlice';
import ModalShell from './ModalShell';
import { deleteBoardImageAssets } from '../../utils/boardStorage';

export default function DeleteBoardModal({ board, onClose }) {
  const dispatch = useDispatch();
  const allBoards = useSelector((state) => state.boards.byId);

  const handleConfirm = async () => {
    Object.entries(allBoards).forEach(([parentBoardId, parentBoard]) => {
      parentBoard.buttons?.forEach((btn) => {
        if (btn.load_board?.id === board.id) {
          dispatch(deleteButton({ boardId: parentBoardId, buttonId: btn.id }));
        }
      });
    });
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
