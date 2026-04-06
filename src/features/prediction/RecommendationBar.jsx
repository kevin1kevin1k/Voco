import { useSpeech } from '../speech/useSpeech';
import './RecommendationBar.css';

export default function RecommendationBar({ board, recommendations }) {
  const { speak } = useSpeech();

  if (!recommendations || recommendations.length === 0) return null;

  const buttonMap = {};
  for (const btn of board.buttons || []) {
    buttonMap[btn.id] = btn;
  }

  const recommendedButtons = recommendations
    .map((id) => buttonMap[id])
    .filter(Boolean);

  if (recommendedButtons.length === 0) return null;

  return (
    <div className="recommendation-bar" role="region" aria-label="推薦詞彙">
      <span className="recommendation-label">推薦：</span>
      {recommendedButtons.map((btn) => (
        <button
          key={btn.id}
          className="recommendation-btn"
          onClick={() => speak(btn.vocalization || btn.label)}
          aria-label={`推薦：${btn.label}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
