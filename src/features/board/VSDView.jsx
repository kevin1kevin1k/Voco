import { useEffect, useState } from 'react';
import { parseHotspot } from '../../utils/obfParser';
import Hotspot from './Hotspot';
import './VSDView.css';

export default function VSDView({ board }) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const background = board.ext_voco_background;
  const backgroundImage = board.images?.find((img) => img.id === background?.image_id);

  const hotspots = (board.buttons || [])
    .map(parseHotspot)
    .filter(Boolean);

  useEffect(() => {
    setImageLoadFailed(false);
  }, [backgroundImage?.url, board.id]);

  const canRenderBackground = Boolean(backgroundImage?.url) && !imageLoadFailed;

  return (
    <div className="vsd-view">
      <div className="vsd-container" role="img" aria-label={`${board.name} 場景`}>
        {canRenderBackground ? (
          <img
            className="vsd-background"
            src={backgroundImage.url}
            alt={board.name}
            onError={() => setImageLoadFailed(true)}
          />
        ) : (
          <div className="vsd-placeholder">
            <p>請上傳 {board.name} 的實景照片</p>
            <p className="vsd-placeholder-path">
              將照片放置於 public{backgroundImage?.url || '/images/scenes/'}
            </p>
          </div>
        )}

        {hotspots.map((hotspot) => (
          <Hotspot key={hotspot.id} hotspot={hotspot} />
        ))}
      </div>
    </div>
  );
}
