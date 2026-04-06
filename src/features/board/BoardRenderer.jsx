import { useSelector } from 'react-redux';
import { selectCurrentBoardId } from '../navigation/navigationSlice';
import { selectBoardById } from './boardSlice';
import { getBoardDisplayType } from '../../utils/obfParser';
import GridView from './GridView';
import VSDView from './VSDView';
import './BoardRenderer.css';

export default function BoardRenderer() {
  const currentBoardId = useSelector(selectCurrentBoardId);
  const board = useSelector((state) => selectBoardById(state, currentBoardId));

  if (!board) {
    return <div className="board-loading">載入中...</div>;
  }

  const displayType = getBoardDisplayType(board);

  return (
    <main className="board-renderer" role="main">
      {displayType === 'vsd' ? (
        <VSDView board={board} />
      ) : (
        <GridView board={board} />
      )}
    </main>
  );
}
