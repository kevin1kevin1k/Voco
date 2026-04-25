/**
 * OBF (Open Board Format) 解析工具
 * 將 OBF JSON 板面資料正規化為 Redux store 可用的格式
 */

/**
 * 判斷板面顯示類型
 * @param {object} board - OBF board JSON
 * @returns {'vsd' | 'grid'}
 */
export function getBoardDisplayType(board) {
  return board.ext_voco_display_type || 'grid';
}

/**
 * 從 OBF board 解析出按鈕列表，附帶圖片資訊
 * @param {object} board - OBF board JSON
 * @returns {Array} 帶有解析後圖片的按鈕陣列
 */
export function parseButtons(board) {
  const imageMap = {};
  if (board.images) {
    for (const img of board.images) {
      imageMap[img.id] = img;
    }
  }

  return (board.buttons || []).map((btn) => ({
    ...btn,
    image: btn.image_id ? imageMap[btn.image_id] : null,
  }));
}

export function mergeBoardImages(staticImages = [], storedImages = []) {
  const storedImageMap = new Map(storedImages.map((image) => [image.id, image]));
  const merged = staticImages.map((image) => storedImageMap.get(image.id) || image);
  const staticImageIds = new Set(staticImages.map((image) => image.id));

  for (const image of storedImages) {
    if (!staticImageIds.has(image.id)) {
      merged.push(image);
    }
  }

  return merged;
}

/**
 * 解析 VSD 熱點座標（百分比 → 相對定位）
 * home.obf.json 中的座標以百分比表示
 * @param {object} button - OBF button with ext_voco_hotspot
 * @returns {object|null} 熱點定位資訊
 */
export function parseHotspot(button) {
  const hotspot = button.ext_voco_hotspot;
  if (!hotspot) return null;

  return {
    id: button.id,
    label: button.label,
    vocalization: button.vocalization || button.label,
    x: hotspot.x,
    y: hotspot.y,
    width: hotspot.width,
    height: hotspot.height,
    shape: hotspot.shape || 'rectangle',
  };
}

/**
 * 從 OBF grid 取得按鈕的排列順序
 * @param {object} board - OBF board JSON
 * @returns {string[][]} 2D button ID 陣列
 */
export function getGridOrder(board) {
  if (!board.grid) return [];
  return board.grid.order || [];
}

import { readBoardsFromStorage } from './boardStorage.js';

function mergeStoredBoard(staticBoard, storedBoard) {
  if (!staticBoard) return storedBoard;
  if (!storedBoard) return staticBoard;

  const allowStoredVsdAssets = storedBoard.ext_voco_user_owned_vsd === true;
  const images = mergeBoardImages(staticBoard.images || [], storedBoard.images || []);

  return {
    ...staticBoard,
    ...storedBoard,
    id: staticBoard.id,
    format: staticBoard.format,
    locale: staticBoard.locale,
    ext_voco_display_type: staticBoard.ext_voco_display_type,
    ext_voco_background: allowStoredVsdAssets
      ? storedBoard.ext_voco_background ?? staticBoard.ext_voco_background
      : staticBoard.ext_voco_background,
    images,
  };
}

/**
 * 載入所有板面資料，合併靜態 JSON 與 localStorage 用戶修改
 * 內建板面以 repo 版本的 schema / 資產為準，使用者可編輯內容再以 localStorage 覆蓋
 * 不存在於靜態 JSON 的板面則視為使用者自訂板面，直接沿用 localStorage
 * @returns {Promise<object>} { byId, allIds }
 */
export async function loadAllBoards() {

  const boardModules = import.meta.glob('/src/data/boards/*.obf.json', { eager: true });
  const byId = {};
  const allIds = [];

  for (const [, module] of Object.entries(boardModules)) {
    const board = module.default || module;
    byId[board.id] = board;
    allIds.push(board.id);
  }

  // Merge user-modified boards from localStorage.
  const stored = readBoardsFromStorage();
  if (stored && stored.byId) {
    for (const [boardId, board] of Object.entries(stored.byId)) {
      byId[boardId] = byId[boardId]
        ? mergeStoredBoard(byId[boardId], board)
        : board;
      if (!allIds.includes(boardId)) {
        allIds.push(boardId);
      }
    }
  }

  return { byId, allIds };
}
