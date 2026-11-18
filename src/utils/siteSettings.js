// Definitions for every admin-editable copy key.
// seed: suggested starting value shown in the admin form on first open.
// fallback: what the site renders when the key has never been saved. Empty = hide the block.
export const SETTING_GROUPS = [
  {
    id: 'global',
    label: 'Thông tin chung',
    description: 'Tên shop, hotline, địa chỉ và kênh liên hệ. Dùng chung ở navbar, footer, trang liên hệ và nút nổi.',
  },
  {
    id: 'about',
    label: 'Trang giới thiệu',
    description: 'Toàn bộ chữ trên trang giới thiệu: câu chuyện, số liệu, giá trị, cam kết và khối kêu gọi.',
  },
  {
    id: 'home',
    label: 'Trang chủ',
    description: 'Các dải chữ trên trang chủ: cam kết, tiêu đề mục, vì sao chọn và khối kêu gọi.',
  },
  {
    id: 'contact',
    label: 'Trang liên hệ',
    description: 'Chữ trên trang liên hệ. Hotline, Zalo, địa chỉ, giờ làm việc dùng chung ở nhóm Thông tin chung.',
  },
];

// Compact helper: group is derived from the key prefix (global. / about. / home. / contact.)
const define = (key, label, seed, options = {}) => ({
  key,
  group: key.split('.')[0],
  label,
  type: 'text',
  seed,
  fallback: '',
  ...options,
});

export const SETTING_DEFINITIONS = [
  // Global
  define('global.siteName', 'Tên shop', 'Tuấn Rèm', { fallback: 'Tuấn Rèm' }),
  define('global.siteTagline', 'Tagline', 'Rèm cửa cao cấp', {
    hint: 'Dòng phụ dưới tên shop ở navbar. Để trống để ẩn.',
  }),
  define('global.siteDescription', 'Mô tả ngắn', 'Chúng tôi cung cấp các loại rèm cửa cao cấp với đa dạng mẫu mã, chất liệu và màu sắc để phù hợp với mọi không gian sống.', {
    type: 'textarea',
    hint: 'Đoạn giới thiệu ngắn ở footer. Để trống để ẩn.',
  }),
  define('global.hotline', 'Hotline', '0937 543 809', {
    type: 'tel',
    hint: 'Số hiển thị cho khách. Nút gọi điện dùng số này. Để trống để ẩn nút gọi.',
  }),
  define('global.email', 'Email', 'tuanremgiare@gmail.com', {
    hint: 'Để trống để ẩn email.',
  }),
  define('global.address', 'Địa chỉ', '15/7A Tân Lập - Đông Hoà - Dĩ An - Bình Dương', {
    type: 'textarea',
    hint: 'Để trống để ẩn địa chỉ. Bản đồ trang liên hệ cũng dùng địa chỉ này.',
  }),
  define('global.zaloUrl', 'Link Zalo', 'https://zalo.me/0937543809', {
    type: 'url',
    hint: 'Để trống để ẩn các nút Zalo.',
  }),
  define('global.youtubeUrl', 'Link YouTube', 'https://www.youtube.com/@Tu%E1%BA%A5nR%C3%A8mB%C3%ACnhD%C6%B0%C6%A1ng', {
    type: 'url',
    hint: 'Để trống để ẩn nút YouTube.',
  }),
  define('global.workingHours', 'Giờ làm việc', 'Thứ Hai – Thứ Bảy: 8:00 – 20:00\nChủ Nhật: 9:00 – 18:00', {
    type: 'textarea',
    hint: 'Mỗi dòng là một ca. Hiển thị ở trang liên hệ.',
  }),
  define('global.shortHours', 'Giờ mở cửa (dạng ngắn)', '8:00 – 20:00', {
    hint: 'Dùng trong các câu như “Hotline … · 8:00 – 20:00”.',
  }),

  // About
  define('about.kicker', 'Nhãn đầu trang', 'Về Tuấn Rèm'),
  define('about.title', 'Tiêu đề lớn', 'Tận tâm với từng ô cửa'),
  define('about.lead', 'Đoạn mở đầu', 'Từ xưởng may nhỏ tại Dĩ An, Tuấn Rèm theo đuổi một điều giản dị: mỗi bộ rèm phải vừa vặn, bền đẹp và hợp với ánh sáng của từng không gian.', { type: 'textarea' }),
  define('about.note', 'Dòng ghi chú dưới mở đầu', 'Dĩ An, Bình Dương · Phục vụ toàn khu vực'),
  define('about.storyTag', 'Nhãn trên ảnh câu chuyện', 'Xưởng may & showroom'),
  define('about.storyCaption', 'Chú thích ảnh câu chuyện', 'May đo, lắp đặt và bảo hành tại Dĩ An, Bình Dương'),
  define('about.storyKicker', 'Nhãn mục câu chuyện', 'Câu chuyện của chúng tôi'),
  define('about.storyTitle', 'Tiêu đề câu chuyện', 'Từ xưởng may nhỏ đến đối tác của nhiều gia đình'),
  define('about.storyP1', 'Đoạn 1 câu chuyện', 'Tuấn Rèm là một cơ sở chuyên về rèm cửa với hơn 10 năm kinh nghiệm trong nghề. Chúng tôi luôn đặt uy tín và chất lượng lên hàng đầu, mong muốn mang đến cho khách hàng những sản phẩm phù hợp, bền đẹp và tinh tế.', { type: 'textarea' }),
  define('about.storyP2', 'Đoạn 2 câu chuyện', 'Với mẫu mã đa dạng và đầy đủ thanh phụ kiện cao cấp cho nhiều loại khung cửa khác nhau, Tuấn Rèm đáp ứng nhu cầu của nhiều không gian – từ nhà ở, căn hộ cho đến văn phòng và cửa hàng. Chúng tôi chú trọng từng chi tiết trong thi công, đảm bảo lắp đặt nhanh gọn, chuẩn xác và đi kèm chế độ bảo hành 12 tháng.', { type: 'textarea' }),
  define('about.fact1', 'Gạch đầu dòng 1', 'Đo đạc và tư vấn mẫu vải tại nhà'),
  define('about.fact2', 'Gạch đầu dòng 2', 'May đo theo kích thước từng ô cửa'),
  define('about.fact3', 'Gạch đầu dòng 3', 'Bảo hành 12 tháng sau lắp đặt'),
  define('about.stat1Value', 'Số liệu 1 — số', '10+'),
  define('about.stat1Label', 'Số liệu 1 — nhãn', 'Năm kinh nghiệm'),
  define('about.stat2Value', 'Số liệu 2 — số', '200+'),
  define('about.stat2Label', 'Số liệu 2 — nhãn', 'Công trình hoàn thành'),
  define('about.stat3Value', 'Số liệu 3 — số', '100+'),
  define('about.stat3Label', 'Số liệu 3 — nhãn', 'Khách hàng hài lòng'),
  define('about.stat4Value', 'Số liệu 4 — số', '12'),
  define('about.stat4Label', 'Số liệu 4 — nhãn', 'Tháng bảo hành'),
  define('about.valuesKicker', 'Nhãn mục giá trị', 'Giá trị cốt lõi'),
  define('about.valuesTitle', 'Tiêu đề mục giá trị', 'Ba điều chúng tôi giữ nguyên'),
  define('about.valuesLead', 'Đoạn dẫn mục giá trị', 'Ba nguyên tắc định hình cách chúng tôi chọn vải, may đo và bàn giao sản phẩm — từ bộ rèm đầu tiên đến hôm nay.', { type: 'textarea' }),
  define('about.value1Title', 'Giá trị 1 — tiêu đề', 'Chất lượng'),
  define('about.value1Text', 'Giá trị 1 — nội dung', 'Chúng tôi cam kết sử dụng những nguyên vật liệu tốt nhất và quy trình sản xuất tiên tiến để tạo ra sản phẩm bền đẹp, an toàn và thân thiện với môi trường.', { type: 'textarea' }),
  define('about.value2Title', 'Giá trị 2 — tiêu đề', 'Dịch vụ khách hàng'),
  define('about.value2Text', 'Giá trị 2 — nội dung', 'Chúng tôi đặt khách hàng vào trung tâm của mọi hoạt động. Từ tư vấn chọn lựa đến lắp đặt và hậu mãi, chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất.', { type: 'textarea' }),
  define('about.value3Title', 'Giá trị 3 — tiêu đề', 'Sáng tạo'),
  define('about.value3Text', 'Giá trị 3 — nội dung', 'Chúng tôi không ngừng đổi mới, cập nhật xu hướng và công nghệ mới nhất để mang đến những sản phẩm độc đáo, thẩm mỹ và đáp ứng nhu cầu ngày càng cao của khách hàng.', { type: 'textarea' }),
  define('about.quoteText', 'Câu trích dẫn', 'Với Tuấn Rèm, mỗi bộ rèm không chỉ là sản phẩm, mà còn là sự chăm chút cho không gian sống của bạn.', { type: 'textarea' }),
  define('about.quoteCite', 'Nguồn trích dẫn', 'Tuấn Rèm'),
  define('about.whyKicker', 'Nhãn mục vì sao', 'Vì sao chọn Tuấn Rèm'),
  define('about.whyTitle', 'Tiêu đề mục vì sao', 'Cam kết trong từng bộ rèm'),
  define('about.whyLead', 'Đoạn dẫn mục vì sao', 'Những cam kết giữ cho trải nghiệm từ lúc đo cửa đến sau lắp đặt luôn rõ ràng, đúng hẹn và đúng kích thước.', { type: 'textarea' }),
  ...[1, 2, 3, 4, 5, 6].flatMap((index) => [
    define(
      `about.reason${index}Title`,
      `Cam kết ${index} — tiêu đề`,
      [
        'Đa dạng sản phẩm',
        'Tư vấn chuyên nghiệp',
        'Sản xuất theo yêu cầu',
        'Lắp đặt chuyên nghiệp',
        'Bảo hành dài hạn',
        'Giá cả cạnh tranh',
      ][index - 1]
    ),
    define(
      `about.reason${index}Text`,
      `Cam kết ${index} — nội dung`,
      [
        'Đầy đủ các loại rèm cửa từ rèm vải, rèm cuốn, rèm sáo đến rèm cầu vồng với nhiều mẫu mã, chất liệu và màu sắc.',
        'Đội ngũ tư vấn giàu kinh nghiệm giúp bạn chọn lựa sản phẩm phù hợp nhất với không gian và ngân sách.',
        'Rèm cửa được may đo theo đúng kích thước và thiết kế riêng của từng ô cửa, từng không gian.',
        'Đội ngũ kỹ thuật viên lành nghề đảm bảo sản phẩm được lắp đặt chính xác, an toàn và thẩm mỹ.',
        'Chế độ bảo hành 12 tháng cùng hỗ trợ chỉnh rèm trong quá trình sử dụng, để bạn yên tâm lâu dài.',
        'Cam kết sản phẩm chất lượng với mức giá hợp lý, báo giá minh bạch theo mét vải trước khi thi công.',
      ][index - 1],
      { type: 'textarea' }
    ),
  ]),
  define('about.ctaKicker', 'Nhãn khối kêu gọi', 'Bắt đầu từ một ô cửa'),
  define('about.ctaTitle', 'Tiêu đề khối kêu gọi', 'Đặt lịch đo và tư vấn miễn phí'),
  define('about.ctaText', 'Nội dung khối kêu gọi', 'Cho chúng tôi biết kích thước hoặc gửi ảnh cửa — Tuấn Rèm hẹn đo tận nhà và báo giá may đo trong 24 giờ làm việc.', { type: 'textarea' }),
  define('about.ctaNote', 'Dòng ghi chú khối kêu gọi', '0937 543 809 · Dĩ An, Bình Dương'),

  // Home
  define('home.trust1Value', 'Cam kết nhanh 1 — số', '20+'),
  define('home.trust1Label', 'Cam kết nhanh 1 — nhãn', 'Năm kinh nghiệm'),
  define('home.trust2Value', 'Cam kết nhanh 2 — số', 'Tận nơi'),
  define('home.trust2Label', 'Cam kết nhanh 2 — nhãn', 'Đo & lắp tại nhà'),
  define('home.trust3Value', 'Cam kết nhanh 3 — số', 'Miễn phí'),
  define('home.trust3Label', 'Cam kết nhanh 3 — nhãn', 'Tư vấn, hẹn đo'),
  define('home.trust4Value', 'Cam kết nhanh 4 — số', 'Bảo hành'),
  define('home.trust4Label', 'Cam kết nhanh 4 — nhãn', 'Sau lắp đặt'),
  define('home.categoriesKicker', 'Nhãn mục danh mục', 'Bộ sưu tập'),
  define('home.categoriesTitle', 'Tiêu đề mục danh mục', 'Danh mục rèm cửa'),
  define('home.categoriesLead', 'Đoạn dẫn mục danh mục', 'Chọn loại rèm theo không gian — phòng khách, phòng ngủ, chống nắng, voan…', { type: 'textarea' }),
  define('home.whyKicker', 'Nhãn mục vì sao', 'Vì sao chọn Tuấn Rèm'),
  define('home.whyTitle', 'Tiêu đề mục vì sao', 'Hơn hai mươi năm may đo và lắp đặt tại Bình Dương.'),
  define('home.whyLead', 'Đoạn dẫn mục vì sao', 'Bạn xem mẫu vải thật tại nhà trước khi quyết định — không chỉ ảnh stock.', { type: 'textarea' }),
  define('home.whyPoint1Title', 'Điểm 1 — tiêu đề', 'Vải và màu thật'),
  define('home.whyPoint1Text', 'Điểm 1 — nội dung', 'Catalogue online cùng mẫu vải mang đến tận nhà khi đo cửa — không chỉ ảnh stock.', { type: 'textarea' }),
  define('home.whyPoint2Title', 'Điểm 2 — tiêu đề', 'Lắp đúng kích thước'),
  define('home.whyPoint2Text', 'Điểm 2 — nội dung', 'Đo cửa, tư vấn kiểu rèm, thi công gọn gàng và bảo hành sau lắp.', { type: 'textarea' }),
  define('home.productsKicker', 'Nhãn mục sản phẩm', 'Tuyển chọn'),
  define('home.productsTitle', 'Tiêu đề mục sản phẩm', 'Sản phẩm nổi bật'),
  define('home.productsLead', 'Đoạn dẫn mục sản phẩm', 'Một vài mẫu hay chọn — xem thêm màu và kích thước tại trang sản phẩm.', { type: 'textarea' }),
  define('home.ctaKicker', 'Nhãn khối kêu gọi', 'Tư vấn miễn phí'),
  define('home.ctaTitle', 'Tiêu đề khối kêu gọi', 'Hẹn đo rèm tại nhà'),
  define('home.ctaLead', 'Nội dung khối kêu gọi', 'Gọi hoặc nhắn Zalo — tư vấn miễn phí, báo giá sau khi đo cửa.', { type: 'textarea' }),

  // Contact
  define('contact.kicker', 'Nhãn đầu trang', 'Liên hệ Tuấn Rèm'),
  define('contact.title', 'Tiêu đề lớn', 'Liên hệ & đặt lịch tư vấn'),
  define('contact.lead', 'Đoạn mở đầu', 'Gửi kích thước cửa hoặc ảnh không gian — Tuấn Rèm tư vấn chất liệu, báo giá may đo và hẹn đo đạc tận nhà trong 24 giờ làm việc.', { type: 'textarea' }),
  define('contact.hotlineHint', 'Gợi ý kênh hotline', 'Gọi trực tiếp mỗi ngày, 8:00 – 20:00'),
  define('contact.zaloValue', 'Kênh Zalo — tên hiển thị', 'Tuấn Rèm'),
  define('contact.zaloHint', 'Kênh Zalo — gợi ý', 'Gửi ảnh cửa, nhận báo giá nhanh'),
  define('contact.showroomValue', 'Kênh showroom — tên hiển thị', 'Dĩ An, Bình Dương'),
  define('contact.showroomHint', 'Kênh showroom — gợi ý', 'Xem vải và phụ kiện thực tế'),
  define('contact.paneKicker', 'Nhãn khối showroom', 'Showroom & xưởng'),
  define('contact.paneTitle', 'Tiêu đề khối showroom', 'Ghé xem vải trực tiếp'),
  define('contact.paneText', 'Nội dung khối showroom', 'Mẫu vải, thanh treo và phụ kiện được trưng bày tại showroom. Mang theo ảnh cửa hoặc bản vẽ để được tư vấn ngay tại chỗ.', { type: 'textarea' }),
  define('contact.infoNote', 'Ghi chú ngoài giờ làm việc', 'Ngoài giờ làm việc, bạn để lại tin nhắn Zalo — Tuấn Rèm phản hồi vào đầu ngày làm việc kế tiếp.', { type: 'textarea' }),
  define('contact.formKicker', 'Nhãn khối form', 'Tư vấn miễn phí'),
  define('contact.formTitle', 'Tiêu đề khối form', 'Gửi yêu cầu tư vấn'),
  define('contact.formText', 'Nội dung khối form', 'Điền thông tin bên dưới, chúng tôi gọi lại trong 24 giờ làm việc để hỏi rõ nhu cầu và hẹn lịch đo.', { type: 'textarea' }),
  define('contact.formNote', 'Ghi chú dưới nút gửi', 'Thông tin chỉ dùng để tư vấn và không chia sẻ cho bên thứ ba.'),
  define('contact.mapKicker', 'Nhãn khối bản đồ', 'Bản đồ'),
  define('contact.mapTitle', 'Tiêu đề khối bản đồ', 'Đường đến Tuấn Rèm'),
  define('contact.ctaKicker', 'Nhãn khối kêu gọi', 'Cần phản hồi nhanh?'),
  define('contact.ctaTitle', 'Tiêu đề khối kêu gọi', 'Gọi trực tiếp để được báo giá sơ bộ'),
  define('contact.ctaText', 'Nội dung khối kêu gọi', 'Hotline mở mỗi ngày từ 8:00 đến 20:00. Gọi hoặc nhắn Zalo — Tuấn Rèm tư vấn ngay, không cần chờ email.', { type: 'textarea' }),
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
