import { useSpeech } from '../speech/useSpeech';
import './Hotspot.css';

export default function Hotspot({ hotspot }) {
  const { speak } = useSpeech();

  const handleClick = (e) => {
    e.stopPropagation();
    speak(hotspot.vocalization);
  };

  return (
    <button
      className="hotspot"
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        width: `${hotspot.width}%`,
        height: `${hotspot.height}%`,
      }}
      onClick={handleClick}
      aria-label={hotspot.label}
      title={hotspot.label}
    >
      <span className="hotspot-label">{hotspot.label}</span>
    </button>
  );
}
