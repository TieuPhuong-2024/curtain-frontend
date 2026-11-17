import Link from 'next/link';
import Image from 'next/image';
import {
  FaArrowRight,
  FaCheck,
  FaLightbulb,
  FaMedal,
  FaRegCommentDots,
  FaUsers,
} from 'react-icons/fa';
import StructuredData, {
  createAboutPageSchema,
  createBreadcrumbSchema,
} from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/About.module.css';

const PHONE_DISPLAY = '0937 543 809';
const ZALO_HREF = 'https://zalo.me/0937543809';

const STATS = [
  {
    value: process.env.NEXT_PUBLIC_YEARS_OF_EXPERIENCE || '10+',
    label: 'Năm kinh nghiệm',
  },
  {
    value: process.env.NEXT_PUBLIC_PROJECTS_COMPLETED || '200+',
    label: 'Công trình hoàn thành',
  },
  {
    value: process.env.NEXT_PUBLIC_HAPPY_CUSTOMERS || '100+',
    label: 'Khách hàng hài lòng',
  },
  {
    value: '12',
    label: 'Tháng bảo hành',
  },
];

const VALUES = [
  {
    icon: FaMedal,
    title: 'Chất lượng',
    text: 'Chúng tôi cam kết sử dụng những nguyên vật liệu tốt nhất và quy trình sản xuất tiên tiến để tạo ra sản phẩm bền đẹp, an toàn và thân thiện với môi trường.',
  },
  {
    icon: FaUsers,
    title: 'Dịch vụ khách hàng',
    text: 'Chúng tôi đặt khách hàng vào trung tâm của mọi hoạt động. Từ tư vấn chọn lựa đến lắp đặt và hậu mãi, chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất.',
  },
  {
    icon: FaLightbulb,
    title: 'Sáng tạo',
    text: 'Chúng tôi không ngừng đổi mới, cập nhật xu hướng và công nghệ mới nhất để mang đến những sản phẩm độc đáo, thẩm mỹ và đáp ứng nhu cầu ngày càng cao của khách hàng.',
  },
];

const REASONS = [
  {
    title: 'Đa dạng sản phẩm',
    text: 'Đầy đủ các loại rèm cửa từ rèm vải, rèm cuốn, rèm sáo đến rèm cầu vồng với nhiều mẫu mã, chất liệu và màu sắc.',
  },
  {
    title: 'Tư vấn chuyên nghiệp',
    text: 'Đội ngũ tư vấn giàu kinh nghiệm giúp bạn chọn lựa sản phẩm phù hợp nhất với không gian và ngân sách.',
  },
  {
    title: 'Sản xuất theo yêu cầu',
    text: 'Rèm cửa được may đo theo đúng kích thước và thiết kế riêng của từng ô cửa, từng không gian.',
  },
  {
    title: 'Lắp đặt chuyên nghiệp',
    text: 'Đội ngũ kỹ thuật viên lành nghề đảm bảo sản phẩm được lắp đặt chính xác, an toàn và thẩm mỹ.',
  },
  {
    title: 'Bảo hành dài hạn',
    text: 'Chế độ bảo hành 12 tháng cùng hỗ trợ chỉnh rèm trong quá trình sử dụng, để bạn yên tâm lâu dài.',
  },
  {
    title: 'Giá cả cạnh tranh',
    text: 'Cam kết sản phẩm chất lượng với mức giá hợp lý, báo giá minh bạch theo mét vải trước khi thi công.',
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <StructuredData
        id="about-page-schema"
        data={createAboutPageSchema({
          title: 'Giới thiệu Tuấn Rèm',
          description:
            'Tuấn Rèm là đơn vị chuyên lắp đặt rèm cửa uy tín và chất lượng tại Việt Nam.',
        })}
      />
      <StructuredData
        id="about-breadcrumb-schema"
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Giới thiệu', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.ABOUT}` },
        ])}
      />

      <header className={styles.pageHead}>
        <div className={styles.headInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
            <span className={styles.breadcrumbCurrent} aria-current="page">
              Giới thiệu
            </span>
          </nav>

          <div className={styles.headGrid}>
            <div>
              <p className={styles.kicker}>Về Tuấn Rèm</p>
              <h1 className={styles.title}>Tận tâm với từng ô cửa</h1>
            </div>
            <div className={styles.headAside}>
              <p className={styles.lead}>
                Từ xưởng may nhỏ tại Dĩ An, Tuấn Rèm theo đuổi một điều giản dị: mỗi bộ rèm
                phải vừa vặn, bền đẹp và hợp với ánh sáng của từng không gian.
              </p>
              <p className={styles.headNote}>Dĩ An, Bình Dương · Phục vụ toàn khu vực</p>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.storySection} aria-labelledby="about-story-title">
        <div className={styles.sectionInner}>
          <div className={styles.storyGrid}>
            <figure className={styles.storyMedia}>
              <div className={styles.storyImageWrap}>
                <Image
                  src="/images/living-room-curtains.jpg"
                  alt="Rèm vải may đo trong không gian phòng khách"
                  fill
                  sizes="(max-width: 900px) 100vw, 45vw"
                  priority
                  className={styles.storyImage}
                />
                <span className={styles.storyTag}>Xưởng may &amp; showroom</span>
              </div>
              <figcaption className={styles.storyCaption}>
                <span>May đo, lắp đặt và bảo hành tại Dĩ An, Bình Dương</span>
                <span className={styles.storyIndex}>01</span>
              </figcaption>
            </figure>

            <div>
              <p className={styles.sectionKicker}>Câu chuyện của chúng tôi</p>
              <h2 id="about-story-title" className={styles.storyTitle}>
                Từ xưởng may nhỏ đến đối tác của nhiều gia đình
              </h2>
              <p className={styles.storyText}>
                Tuấn Rèm là một cơ sở chuyên về rèm cửa với hơn 10 năm kinh nghiệm trong nghề.
                Chúng tôi luôn đặt uy tín và chất lượng lên hàng đầu, mong muốn mang đến cho
                khách hàng những sản phẩm phù hợp, bền đẹp và tinh tế.
              </p>
              <p className={styles.storyText}>
                Với mẫu mã đa dạng và đầy đủ thanh phụ kiện cao cấp cho nhiều loại khung cửa
                khác nhau, Tuấn Rèm đáp ứng nhu cầu của nhiều không gian – từ nhà ở, căn hộ cho
                đến văn phòng và cửa hàng. Chúng tôi chú trọng từng chi tiết trong thi công,
                đảm bảo lắp đặt nhanh gọn, chuẩn xác và đi kèm chế độ bảo hành 12 tháng.
              </p>

              <ul className={styles.storyFacts}>
                <li className={styles.storyFact}>
                  <FaCheck className={styles.storyFactIcon} aria-hidden="true" />
                  Đo đạc và tư vấn mẫu vải tại nhà
                </li>
                <li className={styles.storyFact}>
                  <FaCheck className={styles.storyFactIcon} aria-hidden="true" />
                  May đo theo kích thước từng ô cửa
                </li>
                <li className={styles.storyFact}>
                  <FaCheck className={styles.storyFactIcon} aria-hidden="true" />
                  Bảo hành 12 tháng sau lắp đặt
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsSection} aria-label="Tuấn Rèm qua những con số">
        <div className={styles.sectionInner}>
          <div className={styles.statsInner}>
            {STATS.map(stat => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.valuesSection} aria-labelledby="about-values-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionKicker}>Giá trị cốt lõi</p>
              <h2 id="about-values-title" className={styles.sectionTitle}>
                Ba điều chúng tôi giữ nguyên
              </h2>
            </div>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLead}>
                Ba nguyên tắc định hình cách chúng tôi chọn vải, may đo và bàn giao sản phẩm —
                từ bộ rèm đầu tiên đến hôm nay.
              </p>
            </div>
          </div>

          <div className={styles.valuesGrid}>
            {VALUES.map((value, index) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className={styles.value}>
                  <div className={styles.valueTop}>
                    <span className={styles.valueNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon className={styles.valueIcon} aria-hidden="true" />
                  </div>
                  <h3 className={styles.valueTitle}>{value.title}</h3>
                  <p className={styles.valueText}>{value.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.quoteSection} aria-label="Triết lý của Tuấn Rèm">
        <div className={styles.quoteInner}>
          <span className={styles.quoteMark} aria-hidden="true">
            “
          </span>
          <blockquote className={styles.quote}>
            Với Tuấn Rèm, mỗi bộ rèm không chỉ là sản phẩm, mà còn là sự chăm chút cho không
            gian sống của bạn.
          </blockquote>
          <cite className={styles.quoteCite}>Tuấn Rèm</cite>
        </div>
      </section>

      <section className={styles.whySection} aria-labelledby="about-why-title">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionKicker}>Vì sao chọn Tuấn Rèm</p>
              <h2 id="about-why-title" className={styles.sectionTitle}>
                Cam kết trong từng bộ rèm
              </h2>
            </div>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLead}>
                Những cam kết giữ cho trải nghiệm từ lúc đo cửa đến sau lắp đặt luôn rõ ràng,
                đúng hẹn và đúng kích thước.
              </p>
              <Link href={`/${ROUTES_PATH.CONG_TRINH}`} className={styles.textLink}>
                Xem công trình thực tế
                <FaArrowRight className={styles.textLinkIcon} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.whyGrid}>
            {REASONS.map(reason => (
              <div key={reason.title} className={styles.whyItem}>
                <span className={styles.whyIcon}>
                  <FaCheck aria-hidden="true" />
                </span>
                <div>
                  <h3 className={styles.whyTitle}>{reason.title}</h3>
                  <p className={styles.whyText}>{reason.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="about-cta-title">
        <div className={styles.ctaInner}>
          <p className={styles.ctaKicker}>Bắt đầu từ một ô cửa</p>
          <h2 id="about-cta-title" className={styles.ctaTitle}>
            Đặt lịch đo và tư vấn miễn phí
          </h2>
          <p className={styles.ctaText}>
            Cho chúng tôi biết kích thước hoặc gửi ảnh cửa — Tuấn Rèm hẹn đo tận nhà và báo giá
            may đo trong 24 giờ làm việc.
          </p>
          <div className={styles.ctaActions}>
            <Link href={`/${ROUTES_PATH.CONTACT}`} className={styles.ctaPrimary}>
              Liên hệ tư vấn
              <FaArrowRight aria-hidden="true" />
            </Link>
            <a
              href={ZALO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaGhost}
            >
              <FaRegCommentDots aria-hidden="true" />
              Nhắn Zalo
            </a>
          </div>
          <p className={styles.ctaNote}>{`${PHONE_DISPLAY} · Dĩ An, Bình Dương`}</p>
        </div>
      </section>
    </div>
  );
}
