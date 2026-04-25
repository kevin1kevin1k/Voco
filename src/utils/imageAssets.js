import { saveImageAsset } from './boardStorage';

export function readImageDimensions(file) {
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

export async function createUploadedImageEntry(file, scope) {
  const dimensions = await readImageDimensions(file);
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const imageId = `img-${scope}-${suffix}`;
  const assetId = `asset-${scope}-${suffix}`;
  const savedAsset = await saveImageAsset({
    id: assetId,
    file,
    width: dimensions.width,
    height: dimensions.height,
  });

  return {
    id: imageId,
    width: dimensions.width,
    height: dimensions.height,
    content_type: savedAsset.mimeType,
    file_name: savedAsset.fileName,
    ext_voco_asset_id: savedAsset.id,
  };
}

export function upsertImage(images = [], imageEntry) {
  const withoutExisting = images.filter((image) => image.id !== imageEntry.id);
  return [...withoutExisting, imageEntry];
}

export function isImageReferenced(board, imageId, ignoredButtonId = null) {
  if (!imageId) return false;

  if (board.ext_voco_background?.image_id === imageId) {
    return true;
  }

  return (board.buttons || []).some(
    (button) => button.id !== ignoredButtonId && button.image_id === imageId
  );
}

export function removeImageIfUnused(board, imageId, ignoredButtonId = null) {
  if (!imageId || isImageReferenced(board, imageId, ignoredButtonId)) {
    return board.images || [];
  }

  return (board.images || []).filter((image) => image.id !== imageId);
}
