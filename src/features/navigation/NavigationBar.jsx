import { useSelector, useDispatch } from 'react-redux';
import { navigateTo, goBack, goHome, selectCurrentBoardId, selectCanGoBack } from './navigationSlice';
import { selectBoardById } from '../board/boardSlice';
import { selectIsEditMode, toggleEditMode } from '../caregiver/caregiverSlice';
import { useState } from 'react';
import EditBoardNameModal from '../caregiver/EditBoardNameModal';
import './NavigationBar.css';

export default function NavigationBar() {
  const dispatch = useDispatch();
  const currentBoardId = useSelector(selectCurrentBoardId);
  const canGoBack = useSelector(selectCanGoBack);
  const rootBoard = useSelector((state) => selectBoardById(state, 'root'));
  const currentBoard = useSelector((state) => selectBoardById(state, currentBoardId));
  const isEditMode = useSelector(selectIsEditMode);

  const [showEditBoardNameModal, setShowEditBoardNameModal] = useState(false);

  const isRoot = currentBoardId === 'root';

  return (
    <>
      <nav className="navigation-bar" role="navigation" aria-label="主導航">
        <div className="nav-left">
          {!isRoot && (
            <button
              className="nav-btn nav-back"
              onClick={() => dispatch(goBack())}
              disabled={!canGoBack}
              aria-label="返回上一頁"
            >
              ← 返回
            </button>
          )}
          {!isRoot && (
            <button
              className="nav-btn nav-home"
              onClick={() => dispatch(goHome())}
              aria-label="回首頁"
            >
              🏠 首頁
            </button>
          )}
        </div>

        <div className="nav-title-group">
          <h1 className="nav-title">{currentBoard?.name || '載入中...'}</h1>
          {isEditMode && (
            <button
              className="nav-btn nav-edit-title"
              onClick={() => setShowEditBoardNameModal(true)}
              aria-label="編輯頁面名稱"
            >
              ✎
            </button>
          )}
        </div>

        <div className="nav-categories">
          {rootBoard?.buttons?.map((btn) => (
            <button
              key={btn.id}
              className={`nav-category ${btn.load_board?.id === currentBoardId ? 'active' : ''}`}
              onClick={() => {
                if (btn.load_board) {
                  dispatch(navigateTo(btn.load_board.id));
                }
              }}
              aria-current={btn.load_board?.id === currentBoardId ? 'page' : undefined}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="nav-edit-controls">
          <button
            className={`nav-btn nav-toggle-edit ${isEditMode ? 'nav-toggle-edit--active' : ''}`}
            onClick={() => dispatch(toggleEditMode())}
          >
            {isEditMode ? '完成' : '編輯'}
          </button>
        </div>
      </nav>

      {showEditBoardNameModal && currentBoard && (
        <EditBoardNameModal
          board={currentBoard}
          onClose={() => setShowEditBoardNameModal(false)}
        />
      )}
    </>
  );
}
