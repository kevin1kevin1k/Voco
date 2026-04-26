import { useEffect, useState } from 'react';
import { useSpeech } from '../speech/useSpeech';
import { loadImageAssetObjectUrl } from '../../utils/boardStorage';
import './BoardButton.css';

export default function BoardButton({ button, onNavigate, isEditMode, onEdit }) {
  const { speak } = useSpeech();
  const image = button.image;
  const [assetImageSrc, setAssetImageSrc] = useState('');

  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';

    setAssetImageSrc('');

    if (!image?.ext_voco_asset_id) {
      return () => undefined;
    }

    loadImageAssetObjectUrl(image.ext_voco_asset_id)
      .then((url) => {
        if (!url) return;
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setAssetImageSrc(url);
      })
      .catch(() => setAssetImageSrc(''));

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image?.ext_voco_asset_id]);

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
      onClick={handleClick}
      aria-label={button.vocalization || button.label}
    >
      <div className="button-media" aria-hidden="true">
        {image?.symbol && !assetImageSrc && !image?.url && (
          <span className="button-symbol">{image.symbol}</span>
        )}
        {(assetImageSrc || image?.url) && (
          <img className="button-image" src={assetImageSrc || image.url} alt="" />
        )}
      </div>
      <span className="button-label">
        {button.label}
        {isEditMode && <span className="button-edit-hint">✎</span>}
      </span>
    </button>
  );
}
