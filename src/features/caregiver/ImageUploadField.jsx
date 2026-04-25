import { useEffect, useRef, useState } from 'react';
import { loadImageAssetObjectUrl } from '../../utils/boardStorage';
import './ImageUploadField.css';

export default function ImageUploadField({
  id,
  label,
  previewLabel,
  image,
  selectedFile,
  isRemoved,
  onFileSelect,
  onRemove,
}) {
  const inputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState('');

  useEffect(() => {
    let cancelled = false;
    let nextObjectUrl = '';

    if (isRemoved) {
      setPreviewSrc('');
      return () => undefined;
    }

    if (selectedFile) {
      nextObjectUrl = URL.createObjectURL(selectedFile);
      setPreviewSrc(nextObjectUrl);
      return () => {
        URL.revokeObjectURL(nextObjectUrl);
      };
    }

    if (image?.url) {
      setPreviewSrc(image.url);
      return () => undefined;
    }

    if (image?.ext_voco_asset_id) {
      loadImageAssetObjectUrl(image.ext_voco_asset_id)
        .then((url) => {
          if (cancelled || !url) {
            if (url) URL.revokeObjectURL(url);
            return;
          }
          nextObjectUrl = url;
          setPreviewSrc(url);
        })
        .catch(() => setPreviewSrc(''));
    } else {
      setPreviewSrc('');
    }

    return () => {
      cancelled = true;
      if (nextObjectUrl) {
        URL.revokeObjectURL(nextObjectUrl);
      }
    };
  }, [image?.ext_voco_asset_id, image?.url, isRemoved, selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onRemove();
  };

  const displayLabel = previewLabel?.trim() || label;

  return (
    <div className="modal-field image-upload-field">
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
      <div className="image-upload-preview" aria-live="polite">
        {previewSrc ? (
          <img src={previewSrc} alt={`${displayLabel}圖片預覽`} />
        ) : image?.symbol && !isRemoved ? (
          <span className="image-upload-symbol" aria-label={`${displayLabel}目前符號`}>
            {image.symbol}
          </span>
        ) : (
          <span className="image-upload-empty">尚未選擇圖片</span>
        )}
      </div>
      {(previewSrc || image?.symbol) && (
        <button type="button" className="image-upload-remove" onClick={handleRemove}>
          移除圖片
        </button>
      )}
    </div>
  );
}
