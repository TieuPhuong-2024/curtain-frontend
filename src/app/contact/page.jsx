'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaArrowRight,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegCommentDots,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import StructuredData, {
  createBreadcrumbSchema,
  createContactPageSchema,
} from '@/components/StructureData';
import { createContact } from '@/lib/api';
import { useSettings } from '@/lib/SettingsContext';
import { phoneDigits } from '@/utils/siteSettings';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/Contact.module.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '',
};

export default function ContactPage() {
  const { getValue } = useSettings();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get('product')?.trim();
    if (!product) return;

    setFormData(prev => ({
      ...prev,
      subject: prev.subject || `Đặt lịch tư vấn: ${product}`,
      message: prev.message || `Tôi muốn đặt lịch tư vấn và đo rèm mẫu "${product}".`,
    }));
  }, []);

  const hotline = getValue('global.hotline');
  const hotlineDigits = phoneDigits(hotline);
  const phoneHref = hotlineDigits ? `tel:+84${hotlineDigits.replace(/^0/, '')}` : '';
  const zaloUrl = getValue('global.zaloUrl');
  const email = getValue('global.email');
  const address = getValue('global.address');
  const shortHours = getValue('global.shortHours');
  const workingHours = getValue('global.workingHours');
  const mapHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '';

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (submitting) return;

    // Honeypot: bot điền vào field ẩn thì bỏ qua nhưng vẫn báo thành công
    if (formData.website) {
      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createContact(formData);
      if (!response.success) {
        throw new Error('Có lỗi xảy ra khi gửi yêu cầu');
      }

      toast.success(
        response.message ||
          'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
      );
      setFormData(EMPTY_FORM);
    } catch (error) {
      toast.error(error.message || 'Không thể gửi yêu cầu tư vấn. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <StructuredData
        id="contact-breadcrumb-schema"
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Liên hệ', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONTACT}` },
        ])}
      />
      <StructuredData
        id="contact-page-schema"
        data={createContactPageSchema({
          title: 'Liên hệ - Tuấn Rèm',
          description:
            'Liên hệ với Tuấn Rèm để được tư vấn và báo giá rèm cửa cao cấp, đặt lịch đo đạc tận nhà.',
          phone: hotlineDigits ? `+84-${hotlineDigits.replace(/^0/, '')}` : '',
          email,
        })}
      />

      <header className={styles.pageHead}>
        <div className={styles.headInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Trang chủ</Link>
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
            <span className={styles.breadcrumbCurrent} aria-current="page">
              Liên hệ
            </span>
          </nav>

          <div className={styles.headGrid}>
            <div>
              {getValue('contact.kicker') && (
                <p className={styles.kicker}>{getValue('contact.kicker')}</p>
              )}
              {getValue('contact.title') && (
                <h1 className={styles.title}>{getValue('contact.title')}</h1>
              )}
            </div>
            <div className={styles.headAside}>
              {getValue('contact.lead') && (
                <p className={styles.lead}>{getValue('contact.lead')}</p>
              )}
              {(hotline || shortHours) && (
                <p className={styles.headNote}>
                  {[hotline ? `Hotline ${hotline}` : '', shortHours].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className={styles.channelsSection} aria-label="Kênh liên hệ nhanh">
        <div className={styles.sectionInner}>
          <div className={styles.channelGrid}>
            {phoneHref && (
              <a href={phoneHref} className={styles.channel}>
                <span className={styles.channelIcon}>
                  <FaPhoneAlt aria-hidden="true" />
                </span>
                <span className={styles.channelLabel}>Hotline</span>
                <span className={styles.channelValue}>{hotline}</span>
                {getValue('contact.hotlineHint') && (
                  <span className={styles.channelHint}>{getValue('contact.hotlineHint')}</span>
                )}
                <span className={styles.channelArrow}>
                  Gọi ngay
                  <FaArrowRight className={styles.channelArrowIcon} aria-hidden="true" />
                </span>
              </a>
            )}

            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channel}
              >
                <span className={styles.channelIcon}>
                  <FaRegCommentDots aria-hidden="true" />
                </span>
                <span className={styles.channelLabel}>Zalo</span>
                {getValue('contact.zaloValue') && (
                  <span className={styles.channelValue}>{getValue('contact.zaloValue')}</span>
                )}
                {getValue('contact.zaloHint') && (
                  <span className={styles.channelHint}>{getValue('contact.zaloHint')}</span>
                )}
                <span className={styles.channelArrow}>
                  Mở Zalo
                  <FaArrowRight className={styles.channelArrowIcon} aria-hidden="true" />
                </span>
              </a>
            )}

            {mapHref && (
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.channel}
              >
                <span className={styles.channelIcon}>
                  <FaMapMarkerAlt aria-hidden="true" />
                </span>
                <span className={styles.channelLabel}>Showroom</span>
                {getValue('contact.showroomValue') && (
                  <span className={styles.channelValue}>{getValue('contact.showroomValue')}</span>
                )}
                {getValue('contact.showroomHint') && (
                  <span className={styles.channelHint}>{getValue('contact.showroomHint')}</span>
                )}
                <span className={styles.channelArrow}>
                  Chỉ đường
                  <FaArrowRight className={styles.channelArrowIcon} aria-hidden="true" />
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      <section className={styles.contactSection} aria-labelledby="contact-form-title">
        <div className={styles.sectionInner}>
          <div className={styles.contactGrid}>
            <div className={styles.infoPane}>
              <div>
                {getValue('contact.paneKicker') && (
                  <p className={styles.paneKicker}>{getValue('contact.paneKicker')}</p>
                )}
                {getValue('contact.paneTitle') && (
                  <h2 className={styles.paneTitle}>{getValue('contact.paneTitle')}</h2>
                )}
              </div>
              {getValue('contact.paneText') && (
                <p className={styles.paneText}>{getValue('contact.paneText')}</p>
              )}

              <ul className={styles.infoList}>
                {address && (
                  <li className={styles.infoItem}>
                    <FaMapMarkerAlt className={styles.infoIcon} aria-hidden="true" />
                    <div>
                      <p className={styles.infoLabel}>Địa chỉ</p>
                      <p className={styles.infoValue}>{address}</p>
                    </div>
                  </li>
                )}
                {phoneHref && (
                  <li className={styles.infoItem}>
                    <FaPhoneAlt className={styles.infoIcon} aria-hidden="true" />
                    <div>
                      <p className={styles.infoLabel}>Điện thoại</p>
                      <p className={styles.infoValue}>
                        <a href={phoneHref}>{hotline}</a>
                      </p>
                    </div>
                  </li>
                )}
                {email && (
                  <li className={styles.infoItem}>
                    <FaEnvelope className={styles.infoIcon} aria-hidden="true" />
                    <div>
                      <p className={styles.infoLabel}>Email</p>
                      <p className={styles.infoValue}>
                        <a href={`mailto:${email}`}>{email}</a>
                      </p>
                    </div>
                  </li>
                )}
                {workingHours && (
                  <li className={styles.infoItem}>
                    <FaClock className={styles.infoIcon} aria-hidden="true" />
                    <div>
                      <p className={styles.infoLabel}>Giờ làm việc</p>
                      <p className={styles.infoValue}>
                        {workingHours.split('\n').map((line, index) => (
                          <span key={index}>
                            {index > 0 && <br />}
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </li>
                )}
              </ul>

              {getValue('contact.infoNote') && (
                <p className={styles.infoNote}>{getValue('contact.infoNote')}</p>
              )}
            </div>

            <div id="contact-form" className={styles.formPane}>
              {getValue('contact.formKicker') && (
                <p className={styles.paneKicker}>{getValue('contact.formKicker')}</p>
              )}
              <h2 id="contact-form-title" className={styles.paneTitle}>
                {getValue('contact.formTitle')}
              </h2>
              {getValue('contact.formText') && (
                <p className={styles.paneText}>{getValue('contact.formText')}</p>
              )}

              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={styles.honeypot}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                />

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>
                      Họ và tên <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                      autoComplete="name"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>
                      Số điện thoại <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>
                      Email <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="subject" className={styles.label}>
                      Chủ đề
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Rèm vải, rèm cuốn, rèm cầu vồng…"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message" className={styles.label}>
                    Nội dung cần tư vấn <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={styles.textarea}
                    placeholder="Ví dụ: Cần rèm vải cho phòng khách rộng 4m, hướng nắng tây…"
                    required
                  />
                </div>

                <div className={styles.submitRow}>
                  <button type="submit" className={styles.submit} disabled={submitting}>
                    {submitting ? 'Đang gửi…' : 'Gửi yêu cầu'}
                    {!submitting && (
                      <FaArrowRight className={styles.submitIcon} aria-hidden="true" />
                    )}
                  </button>
                  {getValue('contact.formNote') && (
                    <p className={styles.formNote}>{getValue('contact.formNote')}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection} aria-labelledby="contact-map-title">
        <div className={styles.sectionInner}>
          <div className={styles.mapHead}>
            <div>
              {getValue('contact.mapKicker') && (
                <p className={styles.paneKicker}>{getValue('contact.mapKicker')}</p>
              )}
              {getValue('contact.mapTitle') && (
                <h2 id="contact-map-title" className={styles.mapTitle}>
                  {getValue('contact.mapTitle')}
                </h2>
              )}
              {address && <p className={styles.mapAddress}>{address}</p>}
            </div>
            {mapHref && (
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Mở Google Maps
                <FaArrowRight className={styles.mapLinkIcon} aria-hidden="true" />
              </a>
            )}
          </div>

          <div className={styles.mapFrame}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d979.4783043103389!2d106.7964363!3d10.894199799999999!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d9c911c29f63%3A0x61e3f2694805f3f7!2zxJDGsOG7nW5nIELDoCBIdXnhu4duIFRoYW5oIFF1YW4!5e0!3m2!1svi!2s!4v1746425217612!5m2!1svi!2s"
              title="Bản đồ showroom Tuấn Rèm tại Dĩ An, Bình Dương"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} aria-labelledby="contact-cta-title">
        <div className={styles.ctaInner}>
          {getValue('contact.ctaKicker') && (
            <p className={styles.ctaKicker}>{getValue('contact.ctaKicker')}</p>
          )}
          {getValue('contact.ctaTitle') && (
            <h2 id="contact-cta-title" className={styles.ctaTitle}>
              {getValue('contact.ctaTitle')}
            </h2>
          )}
          {getValue('contact.ctaText') && (
            <p className={styles.ctaText}>{getValue('contact.ctaText')}</p>
          )}
          <div className={styles.ctaActions}>
            {phoneHref && (
              <a href={phoneHref} className={styles.ctaPrimary}>
                <FaPhoneAlt aria-hidden="true" />
                {hotline}
              </a>
            )}
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
          {(hotline || address) && (
            <p className={styles.ctaNote}>
              {[hotline, address].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
