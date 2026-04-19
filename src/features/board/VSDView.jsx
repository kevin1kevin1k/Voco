import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsEditMode } from '../caregiver/caregiverSlice';
import { updateBoard } from './boardSlice';
import { deleteImageAsset, loadImageAssetObjectUrl, saveImageAsset } from '../../utils/boardStorage';
import { parseHotspot } from '../../utils/obfParser';
import Hotspot from './Hotspot';
import EditButtonModal from '../caregiver/EditButtonModal';
import './VSDView.css';

const MIN_HOTSPOT_SIZE = 6;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value) {
  return Number(clamp(value, 0, 100).toFixed(2));
}

function clientPointToPercent(clientX, clientY, bounds) {
  return {
    x: clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100),
    y: clamp(((clientY - bounds.top) / bounds.height) * 100, 0, 100),
  };
}

function rectFromPoints(startPoint, endPoint) {
  return {
    x: Math.min(startPoint.x, endPoint.x),
    y: Math.min(startPoint.y, endPoint.y),
    width: Math.abs(endPoint.x - startPoint.x),
    height: Math.abs(endPoint.y - startPoint.y),
  };
}

function clampRect(rect) {
  let width = clamp(rect.width, MIN_HOTSPOT_SIZE, 100);
  let height = clamp(rect.height, MIN_HOTSPOT_SIZE, 100);
  let x = clamp(rect.x, 0, 100 - MIN_HOTSPOT_SIZE);
  let y = clamp(rect.y, 0, 100 - MIN_HOTSPOT_SIZE);

  if (x + width > 100) {
    width = 100 - x;
  }
  if (y + height > 100) {
    height = 100 - y;
  }

  if (width < MIN_HOTSPOT_SIZE) {
    width = MIN_HOTSPOT_SIZE;
    x = clamp(x, 0, 100 - width);
  }
  if (height < MIN_HOTSPOT_SIZE) {
    height = MIN_HOTSPOT_SIZE;
    y = clamp(y, 0, 100 - height);
  }

  return {
    x: roundPercent(x),
    y: roundPercent(y),
    width: roundPercent(width),
    height: roundPercent(height),
  };
}

function getResizeRect(originRect, handle, deltaX, deltaY) {
  const left = originRect.x;
  const top = originRect.y;
  const right = originRect.x + originRect.width;
  const bottom = originRect.y + originRect.height;

  const oppositeCorners = {
    nw: { x: right, y: bottom },
    ne: { x: left, y: bottom },
    sw: { x: right, y: top },
    se: { x: left, y: top },
  };

  const movingCorners = {
    nw: { x: left + deltaX, y: top + deltaY },
    ne: { x: right + deltaX, y: top + deltaY },
    sw: { x: left + deltaX, y: bottom + deltaY },
    se: { x: right + deltaX, y: bottom + deltaY },
  };

  return rectFromPoints(oppositeCorners[handle], movingCorners[handle]);
}

function getInteractionRect(interaction, bounds) {
  if (!interaction || !bounds) return null;

  const startPoint = clientPointToPercent(
    interaction.startClient.x,
    interaction.startClient.y,
    bounds
  );
  const currentPoint = clientPointToPercent(
    interaction.currentClient.x,
    interaction.currentClient.y,
    bounds
  );

  if (interaction.type === 'draw') {
    return clampRect(rectFromPoints(startPoint, currentPoint));
  }

  const deltaX = currentPoint.x - startPoint.x;
  const deltaY = currentPoint.y - startPoint.y;

  if (interaction.type === 'move') {
    return clampRect({
      x: interaction.originRect.x + deltaX,
      y: interaction.originRect.y + deltaY,
      width: interaction.originRect.width,
      height: interaction.originRect.height,
    });
  }

  if (interaction.type === 'resize') {
    return clampRect(
      getResizeRect(interaction.originRect, interaction.handle, deltaX, deltaY)
    );
  }

  return null;
}

function createDraftHotspot(rect) {
  return {
    id: `btn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: '新區域',
    vocalization: '新區域',
    background_color: 'rgb(240, 240, 240)',
    ext_voco_hotspot: {
      ...rect,
      shape: 'rectangle',
    },
  };
}

function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      reject(new Error('Invalid image file.'));
      URL.revokeObjectURL(objectUrl);
    };

    image.src = objectUrl;
  });
}

export default function VSDView({ board }) {
  const dispatch = useDispatch();
  const isEditMode = useSelector(selectIsEditMode);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const interactionRef = useRef(null);

  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [assetObjectUrl, setAssetObjectUrl] = useState(null);
  const [drawMode, setDrawMode] = useState(false);
  const [interaction, setInteraction] = useState(null);
  const [editingButton, setEditingButton] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const background = board.ext_voco_background;
  const backgroundImage = board.images?.find((img) => img.id === background?.image_id);
  const hotspots = (board.buttons || []).map(parseHotspot).filter(Boolean);

  useEffect(() => {
    interactionRef.current = interaction;
  }, [interaction]);

  useEffect(() => {
    let cancelled = false;
    let nextObjectUrl = null;

    setImageLoadFailed(false);
    setAssetObjectUrl(null);

    if (!backgroundImage?.ext_voco_asset_id) {
      return () => undefined;
    }

    loadImageAssetObjectUrl(backgroundImage.ext_voco_asset_id)
      .then((objectUrl) => {
        if (!objectUrl) {
          throw new Error('Missing asset object URL.');
        }
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        nextObjectUrl = objectUrl;
        setAssetObjectUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setImageLoadFailed(true);
        }
      });

    return () => {
      cancelled = true;
      if (nextObjectUrl) {
        URL.revokeObjectURL(nextObjectUrl);
      }
    };
  }, [backgroundImage?.ext_voco_asset_id, board.id]);

  useEffect(() => {
    if (!interaction) return undefined;

    const handlePointerMove = (event) => {
      setInteraction((current) =>
        current
          ? {
              ...current,
              currentClient: { x: event.clientX, y: event.clientY },
            }
          : current
      );
    };

    const handlePointerUp = (event) => {
      const activeInteraction = interactionRef.current;
      const bounds = containerRef.current?.getBoundingClientRect();

      if (!activeInteraction || !bounds) {
        setInteraction(null);
        setDrawMode(false);
        return;
      }

      const finalizedInteraction = {
        ...activeInteraction,
        currentClient: { x: event.clientX, y: event.clientY },
      };
      const nextRect = getInteractionRect(finalizedInteraction, bounds);
      const movedDistance = Math.hypot(
        event.clientX - activeInteraction.startClient.x,
        event.clientY - activeInteraction.startClient.y
      );

      if (activeInteraction.type === 'draw') {
        setDrawMode(false);
        if (nextRect) {
          setEditingButton(createDraftHotspot(nextRect));
        }
      }

      if ((activeInteraction.type === 'move' || activeInteraction.type === 'resize') && nextRect) {
        if (activeInteraction.type === 'move' && movedDistance < 4) {
          const existingButton = board.buttons.find((btn) => btn.id === activeInteraction.buttonId);
          if (existingButton) {
            setEditingButton(existingButton);
          }
        } else {
          const updatedButtons = board.buttons.map((btn) =>
            btn.id === activeInteraction.buttonId
              ? {
                  ...btn,
                  ext_voco_hotspot: {
                    ...btn.ext_voco_hotspot,
                    ...nextRect,
                    shape: 'rectangle',
                  },
                }
              : btn
          );
          dispatch(updateBoard({ ...board, buttons: updatedButtons }));
        }
      }

      setInteraction(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [board, dispatch, interaction]);

  const backgroundSrc = assetObjectUrl || backgroundImage?.url || '';
  const canRenderBackground = Boolean(backgroundSrc) && !imageLoadFailed;
  const containerBounds = containerRef.current?.getBoundingClientRect() || null;
  const previewRect = getInteractionRect(interaction, containerBounds);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleBackgroundUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadError('');

      const dimensions = await readImageDimensions(file);
      const assetId = `asset-${board.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const savedAsset = await saveImageAsset({
        id: assetId,
        file,
        width: dimensions.width,
        height: dimensions.height,
      });

      if (backgroundImage?.ext_voco_asset_id) {
        await deleteImageAsset(backgroundImage.ext_voco_asset_id);
      }

      const imageId = background?.image_id || `img-${board.id}-background`;
      const nextImages = (board.images || []).filter((image) => image.id !== imageId);
      nextImages.push({
        id: imageId,
        width: dimensions.width,
        height: dimensions.height,
        content_type: savedAsset.mimeType,
        file_name: savedAsset.fileName,
        ext_voco_asset_id: savedAsset.id,
      });

      dispatch(
        updateBoard({
          ...board,
          ext_voco_user_owned_vsd: true,
          ext_voco_background: {
            image_id: imageId,
            width: dimensions.width,
            height: dimensions.height,
          },
          images: nextImages,
        })
      );
      setImageLoadFailed(false);
    } catch {
      setUploadError('背景圖儲存失敗，請重新選擇圖片。');
    } finally {
      event.target.value = '';
    }
  };

  const handleCanvasPointerDown = (event) => {
    if (!isEditMode || !drawMode) return;

    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    event.preventDefault();
    setInteraction({
      type: 'draw',
      startClient: { x: event.clientX, y: event.clientY },
      currentClient: { x: event.clientX, y: event.clientY },
    });
  };

  const handleHotspotPointerDown = (event, hotspot) => {
    if (!isEditMode) return;

    event.preventDefault();
    event.stopPropagation();
    setInteraction({
      type: 'move',
      buttonId: hotspot.id,
      originRect: hotspot,
      startClient: { x: event.clientX, y: event.clientY },
      currentClient: { x: event.clientX, y: event.clientY },
    });
  };

  const handleResizePointerDown = (event, hotspot, handle) => {
    if (!isEditMode) return;

    event.preventDefault();
    event.stopPropagation();
    setInteraction({
      type: 'resize',
      handle,
      buttonId: hotspot.id,
      originRect: hotspot,
      startClient: { x: event.clientX, y: event.clientY },
      currentClient: { x: event.clientX, y: event.clientY },
    });
  };

  const resolveRenderedHotspot = (hotspot) => {
    if (interaction?.buttonId === hotspot.id && previewRect) {
      return { ...hotspot, ...previewRect };
    }
    return hotspot;
  };

  return (
    <div className="vsd-view">
      {isEditMode && (
        <div className="vsd-toolbar">
          <button type="button" className="vsd-toolbar-btn" onClick={openFilePicker}>
            {backgroundSrc ? '更換背景圖' : '上傳背景圖'}
          </button>
          <button
            type="button"
            className={`vsd-toolbar-btn ${drawMode ? 'vsd-toolbar-btn--active' : ''}`}
            onClick={() => setDrawMode((current) => !current)}
          >
            {drawMode ? '取消新增區域' : '新增區域'}
          </button>
          {uploadError && <span className="vsd-toolbar-error">{uploadError}</span>}
          <input
            ref={fileInputRef}
            className="vsd-file-input"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleBackgroundUpload}
          />
        </div>
      )}

      <div className="vsd-container" ref={containerRef} role="img" aria-label={`${board.name} 場景`}>
        {canRenderBackground ? (
          <img
            className="vsd-background"
            src={backgroundSrc}
            alt={board.name}
            onError={() => setImageLoadFailed(true)}
          />
        ) : (
          <div className="vsd-placeholder">
            <p>{isEditMode ? `請上傳 ${board.name} 的照片或格局圖` : `${board.name} 尚未設定背景圖`}</p>
            <p className="vsd-placeholder-path">
              {isEditMode
                ? '可使用上方工具列上傳或替換背景圖，資料只會保留在這台裝置。'
                : '請由照護者進入編輯模式後上傳照片或格局圖。'}
            </p>
          </div>
        )}

        {isEditMode && (
          <div
            className={`vsd-edit-canvas ${drawMode ? 'vsd-edit-canvas--draw' : ''}`}
            onPointerDown={handleCanvasPointerDown}
            aria-hidden="true"
          />
        )}

        {isEditMode &&
          hotspots.map((hotspot) => {
            const renderedHotspot = resolveRenderedHotspot(hotspot);
            return (
              <div
                key={hotspot.id}
                className={`vsd-edit-hotspot ${interaction?.buttonId === hotspot.id ? 'is-active' : ''}`}
                style={{
                  left: `${renderedHotspot.x}%`,
                  top: `${renderedHotspot.y}%`,
                  width: `${renderedHotspot.width}%`,
                  height: `${renderedHotspot.height}%`,
                }}
                role="button"
                tabIndex={0}
                aria-label={`編輯區域：${hotspot.label}`}
                onPointerDown={(event) => handleHotspotPointerDown(event, renderedHotspot)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const existingButton = board.buttons.find((btn) => btn.id === hotspot.id);
                    if (existingButton) {
                      setEditingButton(existingButton);
                    }
                  }
                }}
              >
                <span className="vsd-edit-hotspot-label">{hotspot.label}</span>
                {['nw', 'ne', 'sw', 'se'].map((handle) => (
                  <span
                    key={handle}
                    className={`vsd-edit-handle vsd-edit-handle--${handle}`}
                    onPointerDown={(event) => handleResizePointerDown(event, renderedHotspot, handle)}
                  />
                ))}
              </div>
            );
          })}

        {isEditMode && interaction?.type === 'draw' && previewRect && (
          <div
            className="vsd-edit-preview"
            style={{
              left: `${previewRect.x}%`,
              top: `${previewRect.y}%`,
              width: `${previewRect.width}%`,
              height: `${previewRect.height}%`,
            }}
          />
        )}

        {!isEditMode &&
          hotspots.map((hotspot) => <Hotspot key={hotspot.id} hotspot={hotspot} />)}
      </div>

      {editingButton && (
        <EditButtonModal
          button={editingButton}
          board={board}
          onClose={() => setEditingButton(null)}
        />
      )}
    </div>
  );
}
