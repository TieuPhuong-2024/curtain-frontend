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
import { createSettingReader, getServerSettings } from '@/lib/serverSettings';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/About.module.css';

const VALUE_ICONS = [FaMedal, FaUsers, FaLightbulb];

export default async function AboutPage() {
  const settings = await getServerSettings();
  const v = createSettingReader(settings);

  const stats = [1, 2, 3, 4]
    .map((index) => ({
      value: v(`about.stat${index}Value`),
      label: v(`about.stat${index}Label`),
    }))
    .filter((stat) => stat.value || stat.label);

  const values = VALUE_ICONS.map((icon, position) => ({
    icon,
    title: v(`about.value${position + 1}Title`),
    text: v(`about.value${position + 1}Text`),
  })).filter((value) => value.title || value.text);

  const reasons = [1, 2, 3, 4, 5, 6]
    .map((index) => ({
      title: v(`about.reason${index}Title`),
      text: v(`about.reason${index}Text`),
    }))
    .filter((reason) => reason.title || reason.text);

  const facts = [1, 2, 3].map((index) => v(`about.fact${index}`)).filter(Boolean);

  const zaloUrl = v('global.zaloUrl');
  const quoteText = v('about.quoteText');

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
              {v('about.kicker') && <p className={styles.kicker}>{v('about.kicker')}</p>}
              {v('about.title') && <h1 className={styles.title}>{v('about.title')}</h1>}
            </div>
            <div className={styles.headAside}>
              {v('about.lead') && <p className={styles.lead}>{v('about.lead')}</p>}
              {v('about.note') && <p className={styles.headNote}>{v('about.note')}</p>}
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
                {v('about.storyTag') && (
                  <span className={styles.storyTag}>{v('about.storyTag')}</span>
                )}
              </div>
              <figcaption className={styles.storyCaption}>
                <span>{v('about.storyCaption')}</span>
                <span className={styles.storyIndex}>01</span>
              </figcaption>
            </figure>

            <div>
              {v('about.storyKicker') && (
                <p className={styles.sectionKicker}>{v('about.storyKicker')}</p>
              )}
              {v('about.storyTitle') && (
                <h2 id="about-story-title" className={styles.storyTitle}>
                  {v('about.storyTitle')}
                </h2>
              )}
              {v('about.storyP1') && <p className={styles.storyText}>{v('about.storyP1')}</p>}
              {v('about.storyP2') && <p className={styles.storyText}>{v('about.storyP2')}</p>}

              {facts.length > 0 && (
                <ul className={styles.storyFacts}>
                  {facts.map((fact) => (
                    <li key={fact} className={styles.storyFact}>
                      <FaCheck className={styles.storyFactIcon} aria-hidden="true" />
                      {fact}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className={styles.statsSection} aria-label="Tuấn Rèm qua những con số">
          <div className={styles.sectionInner}>
            <div className={styles.statsInner}>
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className={styles.statItem}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className={styles.valuesSection} aria-labelledby="about-values-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div>
                {v('about.valuesKicker') && (
                  <p className={styles.sectionKicker}>{v('about.valuesKicker')}</p>
                )}
                {v('about.valuesTitle') && (
                  <h2 id="about-values-title" className={styles.sectionTitle}>
                    {v('about.valuesTitle')}
                  </h2>
                )}
              </div>
              <div className={styles.sectionAside}>
                {v('about.valuesLead') && (
                  <p className={styles.sectionLead}>{v('about.valuesLead')}</p>
                )}
              </div>
            </div>

            <div className={styles.valuesGrid}>
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <article key={`${value.title}-${index}`} className={styles.value}>
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
      )}

      {quoteText && (
        <section className={styles.quoteSection} aria-label="Triết lý của Tuấn Rèm">
          <div className={styles.quoteInner}>
            <span className={styles.quoteMark} aria-hidden="true">
              “
            </span>
            <blockquote className={styles.quote}>{quoteText}</blockquote>
            {v('about.quoteCite') && <cite className={styles.quoteCite}>{v('about.quoteCite')}</cite>}
          </div>
        </section>
      )}

      {reasons.length > 0 && (
        <section className={styles.whySection} aria-labelledby="about-why-title">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div>
                {v('about.whyKicker') && (
                  <p className={styles.sectionKicker}>{v('about.whyKicker')}</p>
                )}
                {v('about.whyTitle') && (
                  <h2 id="about-why-title" className={styles.sectionTitle}>
                    {v('about.whyTitle')}
                  </h2>
                )}
              </div>
              <div className={styles.sectionAside}>
                {v('about.whyLead') && (
                  <p className={styles.sectionLead}>{v('about.whyLead')}</p>
                )}
                <Link href={`/${ROUTES_PATH.CONG_TRINH}`} className={styles.textLink}>
                  Xem công trình thực tế
                  <FaArrowRight className={styles.textLinkIcon} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className={styles.whyGrid}>
              {reasons.map((reason, index) => (
                <div key={`${reason.title}-${index}`} className={styles.whyItem}>
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
      )}

      <section className={styles.ctaSection} aria-labelledby="about-cta-title">
        <div className={styles.ctaInner}>
          {v('about.ctaKicker') && <p className={styles.ctaKicker}>{v('about.ctaKicker')}</p>}
          {v('about.ctaTitle') && (
            <h2 id="about-cta-title" className={styles.ctaTitle}>
              {v('about.ctaTitle')}
            </h2>
          )}
          {v('about.ctaText') && <p className={styles.ctaText}>{v('about.ctaText')}</p>}
          <div className={styles.ctaActions}>
            <Link href={`/${ROUTES_PATH.CONTACT}`} className={styles.ctaPrimary}>
              Liên hệ tư vấn
              <FaArrowRight aria-hidden="true" />
            </Link>
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaGhost}
              >
                <FaRegCommentDots aria-hidden="true" />
                Nhắn Zalo
              </a>
            )}
          </div>
          {v('about.ctaNote') && <p className={styles.ctaNote}>{v('about.ctaNote')}</p>}
        </div>
      </section>
    </div>
  );
}
