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

/**
 * 載入所有板面資料
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

  return { byId, allIds };
}
