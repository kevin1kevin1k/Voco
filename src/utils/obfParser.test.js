import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getBoardDisplayType,
  getGridOrder,
  mergeBoardImages,
  parseButtons,
  parseHotspot,
} from './obfParser.js';

test('getBoardDisplayType returns the explicit display type or defaults to grid', () => {
  assert.equal(getBoardDisplayType({ ext_voco_display_type: 'vsd' }), 'vsd');
  assert.equal(getBoardDisplayType({}), 'grid');
});

test('parseButtons maps image_id to image metadata and leaves missing images as null', () => {
  const board = {
    images: [
      { id: 'img-tv', url: '/images/tv.svg', symbol: 'TV' },
    ],
    buttons: [
      { id: 'btn-tv', label: '電視', image_id: 'img-tv' },
      { id: 'btn-lamp', label: '電燈' },
    ],
  };

  const parsedButtons = parseButtons(board);

  assert.deepEqual(parsedButtons[0].image, {
    id: 'img-tv',
    url: '/images/tv.svg',
    symbol: 'TV',
  });
  assert.equal(parsedButtons[1].image, null);
});

test('parseHotspot normalizes hotspot fields and falls back to label/rectangle defaults', () => {
  const hotspot = parseHotspot({
    id: 'btn-sofa',
    label: '沙發',
    ext_voco_hotspot: { x: 10, y: 20, width: 30, height: 40 },
  });

  assert.deepEqual(hotspot, {
    id: 'btn-sofa',
    label: '沙發',
    vocalization: '沙發',
    x: 10,
    y: 20,
    width: 30,
    height: 40,
    shape: 'rectangle',
  });
  assert.equal(parseHotspot({ id: 'btn-empty', label: '空白' }), null);
});

test('getGridOrder returns grid order when present and an empty list otherwise', () => {
  assert.deepEqual(
    getGridOrder({
      grid: {
        order: [['btn-wife', 'btn-son']],
      },
    }),
    [['btn-wife', 'btn-son']]
  );
  assert.deepEqual(getGridOrder({}), []);
});

test('mergeBoardImages preserves user uploaded image metadata alongside static images', () => {
  const images = mergeBoardImages(
    [
      { id: 'img-family', symbol: '家' },
      { id: 'img-static', url: '/static.svg' },
    ],
    [
      { id: 'img-family', ext_voco_asset_id: 'asset-family', content_type: 'image/png' },
      { id: 'img-custom', ext_voco_asset_id: 'asset-custom', content_type: 'image/png' },
    ]
  );

  assert.deepEqual(images, [
    { id: 'img-family', ext_voco_asset_id: 'asset-family', content_type: 'image/png' },
    { id: 'img-static', url: '/static.svg' },
    { id: 'img-custom', ext_voco_asset_id: 'asset-custom', content_type: 'image/png' },
  ]);
});
