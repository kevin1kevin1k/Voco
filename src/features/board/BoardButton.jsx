import { useSpeech } from '../speech/useSpeech';
import './BoardButton.css';

export default function BoardButton({ button, onNavigate, isEditMode, onEdit }) {
  const { speak } = useSpeech();
  const image = button.image;

  const handleClick = () => {
    if (isEditMode) {
      onEdit?.();
      return;
    }
    if (button.load_board) {
      onNavigate(button.load_board.id);
    } else {
      speak(button.vocalization || button.label);
    }
  };

  return (
    <button
      className="board-button"
      style={{
        backgroundColor: button.background_color || '#f0f0f0',
      }}
      onClick={handleClick}
      aria-label={button.vocalization || button.label}
    >
      {image?.symbol && <span className="button-symbol">{image.symbol}</span>}
      {image?.url && <img className="button-image" src={image.url} alt="" />}
      <span className="button-label">
        {button.label}
        {isEditMode && <span className="button-edit-hint">✎</span>}
      </span>
    </button>
  );
}
