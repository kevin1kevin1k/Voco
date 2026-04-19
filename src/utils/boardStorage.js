const STORAGE_KEY = 'voco_boards';
const ASSET_DB_NAME = 'voco_assets';
const ASSET_STORE_NAME = 'images';

/**
 * Serialize user-modified boards to localStorage.
 * @param {{ byId: object, allIds: string[] }} boards
 */
export function saveBoardsToStorage(boards) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // Silently ignore write errors (e.g. private browsing quota)
  }
}

/**
 * Read user-modified boards from localStorage.
 * @returns {{ byId: object, allIds: string[] } | null}
 */
export function readBoardsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function openAssetDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is unavailable.'));
      return;
    }

    const request = indexedDB.open(ASSET_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        db.createObjectStore(ASSET_STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open asset database.'));
  });
}

function runAssetTransaction(mode, execute) {
  return openAssetDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(ASSET_STORE_NAME, mode);
        const store = tx.objectStore(ASSET_STORE_NAME);

        let settled = false;
        const finish = (handler, value) => {
          if (settled) return;
          settled = true;
          handler(value);
        };

        tx.oncomplete = () => {
          db.close();
        };
        tx.onerror = () => {
          const err = tx.error || new Error('Asset transaction failed.');
          db.close();
          finish(reject, err);
        };
        tx.onabort = () => {
          const err = tx.error || new Error('Asset transaction aborted.');
          db.close();
          finish(reject, err);
        };

        execute(store, {
          resolve: (value) => finish(resolve, value),
          reject: (err) => finish(reject, err),
        });
      })
  );
}

export function getBoardAssetIds(board) {
  return (board?.images || [])
    .map((image) => image.ext_voco_asset_id)
    .filter(Boolean);
}

export async function saveImageAsset({ id, file, width, height }) {
  const assetId = id || `asset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const record = {
    id: assetId,
    blob: file,
    mimeType: file.type || 'application/octet-stream',
    fileName: file.name || assetId,
    width: width ?? null,
    height: height ?? null,
    updatedAt: Date.now(),
  };

  return runAssetTransaction('readwrite', (store, { resolve, reject }) => {
    const request = store.put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error || new Error('Failed to save image asset.'));
  });
}

export async function readImageAsset(assetId) {
  if (!assetId) return null;

  return runAssetTransaction('readonly', (store, { resolve, reject }) => {
    const request = store.get(assetId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error('Failed to read image asset.'));
  });
}

export async function loadImageAssetObjectUrl(assetId) {
  const record = await readImageAsset(assetId);
  if (!record?.blob) return null;
  return URL.createObjectURL(record.blob);
}

export async function deleteImageAsset(assetId) {
  if (!assetId) return;

  await runAssetTransaction('readwrite', (store, { resolve, reject }) => {
    const request = store.delete(assetId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error('Failed to delete image asset.'));
  });
}

export async function deleteBoardImageAssets(board) {
  const assetIds = getBoardAssetIds(board);
  await Promise.all(assetIds.map((assetId) => deleteImageAsset(assetId)));
}
