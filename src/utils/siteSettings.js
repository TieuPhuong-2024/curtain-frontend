// Definitions for every admin-editable copy key.
// seed: suggested starting value shown in the admin form on first open.
// fallback: what the site renders when the key has never been saved. Empty = hide the block.
export const SETTING_GROUPS = [
  {
    id: 'global',
    label: 'Thông tin chung',
    description: 'Tên shop, hotline, địa chỉ và kênh liên hệ. Dùng chung ở navbar, footer và nút liên hệ nổi.',
  },
];

export const SETTING_DEFINITIONS = [
  {
    key: 'global.siteName',
    group: 'global',
    label: 'Tên shop',
    type: 'text',
    seed: 'Tuấn Rèm',
    fallback: 'Tuấn Rèm',
  },
  {
    key: 'global.siteTagline',
    group: 'global',
    label: 'Tagline',
    type: 'text',
    seed: 'Rèm cửa cao cấp',
    fallback: '',
    hint: 'Dòng phụ dưới tên shop ở navbar. Để trống để ẩn.',
  },
  {
    key: 'global.siteDescription',
    group: 'global',
    label: 'Mô tả ngắn',
    type: 'textarea',
    seed:
      'Chúng tôi cung cấp các loại rèm cửa cao cấp với đa dạng mẫu mã, chất liệu và màu sắc để phù hợp với mọi không gian sống.',
    fallback: '',
    hint: 'Đoạn giới thiệu ngắn ở footer. Để trống để ẩn.',
  },
  {
    key: 'global.hotline',
    group: 'global',
    label: 'Hotline',
    type: 'tel',
    seed: '0937 543 809',
    fallback: '',
    hint: 'Số hiển thị cho khách. Nút gọi điện dùng số này. Để trống để ẩn nút gọi.',
  },
  {
    key: 'global.email',
    group: 'global',
    label: 'Email',
    type: 'text',
    seed: 'tuanremgiare@gmail.com',
    fallback: '',
    hint: 'Để trống để ẩn email ở footer.',
  },
  {
    key: 'global.address',
    group: 'global',
    label: 'Địa chỉ',
    type: 'textarea',
    seed: '15/7A Tân Lập - Đông Hoà - Dĩ An - Bình Dương',
    fallback: '',
    hint: 'Để trống để ẩn địa chỉ ở footer.',
  },
  {
    key: 'global.zaloUrl',
    group: 'global',
    label: 'Link Zalo',
    type: 'url',
    seed: 'https://zalo.me/0937543809',
    fallback: '',
    hint: 'Để trống để ẩn nút Zalo.',
  },
  {
    key: 'global.youtubeUrl',
    group: 'global',
    label: 'Link YouTube',
    type: 'url',
    seed: 'https://www.youtube.com/@Tu%E1%BA%A5nR%C3%A8mB%C3%ACnhD%C6%B0%C6%A1ng',
    fallback: '',
    hint: 'Để trống để ẩn nút YouTube.',
  },
];

export const SETTINGS_FALLBACK = Object.fromEntries(
  SETTING_DEFINITIONS.map((definition) => [definition.key, definition.fallback])
);

export const SETTINGS_SEED = Object.fromEntries(
  SETTING_DEFINITIONS.map((definition) => [definition.key, definition.seed])
);

export const getSettingFallback = (key) =>
  Object.prototype.hasOwnProperty.call(SETTINGS_FALLBACK, key) ? SETTINGS_FALLBACK[key] : '';

export const phoneDigits = (value) => String(value || '').replace(/\D/g, '');
