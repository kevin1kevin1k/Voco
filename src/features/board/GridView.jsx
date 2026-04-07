import { useDispatch, useSelector } from 'react-redux';
import { navigateTo } from '../navigation/navigationSlice';
import { recordClick, selectClickHistory, computeRecommendations } from '../prediction/predictionSlice';
import { parseButtons, getGridOrder } from '../../utils/obfParser';
import BoardButton from './BoardButton';
import RecommendationBar from '../prediction/RecommendationBar';
import './GridView.css';

export default function GridView({ board }) {
  const dispatch = useDispatch();
  const clickHistory = useSelector(selectClickHistory);

  const buttons = parseButtons(board);
  const gridOrder = getGridOrder(board);
  const recommendations = computeRecommendations(board, clickHistory);

  const buttonMap = {};
  for (const btn of buttons) {
    buttonMap[btn.id] = btn;
  }

  const handleNavigate = (boardId) => {
    dispatch(navigateTo(boardId));
  };

  const handleButtonClick = (button) => {
    dispatch(recordClick({ buttonId: button.id, boardId: board.id }));
  };

  const rows = board.grid?.rows || 1;
  const columns = board.grid?.columns || 1;

  return (
    <div className="grid-view">
      <RecommendationBar board={board} recommendations={recommendations} />
      <div
        className="grid-container"
        style={{
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
        role="grid"
        aria-label={`${board.name} 按鈕網格`}
      >
        {gridOrder.flat().map((btnId) => {
          const button = buttonMap[btnId];
          if (!button) return <div key={btnId} className="grid-empty" />;
          return (
            <div key={btnId} role="gridcell" style={{ display: 'contents' }} onClick={() => handleButtonClick(button)}>
              <BoardButton button={button} onNavigate={handleNavigate} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
