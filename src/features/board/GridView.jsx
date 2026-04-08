import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { navigateTo } from '../navigation/navigationSlice';
import { recordClick, selectClickHistory, computeRecommendations } from '../prediction/predictionSlice';
import { selectIsEditMode } from '../caregiver/caregiverSlice';
import { parseButtons, getGridOrder } from '../../utils/obfParser';
import BoardButton from './BoardButton';
import RecommendationBar from '../prediction/RecommendationBar';
import EditButtonModal from '../caregiver/EditButtonModal';
import AddButtonModal from '../caregiver/AddButtonModal';
import './GridView.css';

export default function GridView({ board }) {
  const dispatch = useDispatch();
  const clickHistory = useSelector(selectClickHistory);
  const isEditMode = useSelector(selectIsEditMode);

  const [editingButton, setEditingButton] = useState(null);
  const [showAddButtonModal, setShowAddButtonModal] = useState(false);

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
    if (!isEditMode) {
      dispatch(recordClick({ buttonId: button.id, boardId: board.id }));
    }
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
        {gridOrder.flat().map((btnId, idx) => {
          const button = buttonMap[btnId];
          if (!button) return <div key={btnId ?? `empty-${idx}`} className="grid-empty" />;
          return (
            <div
              key={btnId}
              role="gridcell"
              className="grid-cell-wrapper"
              onClick={() => handleButtonClick(button)}
            >
              <BoardButton button={button} onNavigate={handleNavigate} isEditMode={isEditMode} />
              {isEditMode && (
                <button
                  className="btn-edit-overlay"
                  aria-label={`編輯 ${button.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingButton(button);
                  }}
                >
                  ✎
                </button>
              )}
            </div>
          );
        })}

        {isEditMode && (
          <button
            className="grid-add-button"
            onClick={() => setShowAddButtonModal(true)}
            aria-label="新增按鈕"
          >
            ＋ 新增按鈕
          </button>
        )}
      </div>

      {editingButton && (
        <EditButtonModal
          button={editingButton}
          board={board}
          onClose={() => setEditingButton(null)}
        />
      )}
      {showAddButtonModal && (
        <AddButtonModal
          board={board}
          onClose={() => setShowAddButtonModal(false)}
        />
      )}
    </div>
  );
}
