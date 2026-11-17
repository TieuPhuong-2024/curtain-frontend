'use client';

import { useState } from 'react';
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
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/Contact.module.css';

const PHONE_DISPLAY = '0937 543 809';
const PHONE_HREF = 'tel:+84937543809';
const ZALO_HREF = 'https://zalo.me/0937543809';
const EMAIL = 'tuanremgiare@gmail.com';
const ADDRESS = '15/7A Tân Lập - Đông Hòa - Dĩ An - Bình Dương';
const MAP_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  '15/7A Tân Lập, Đông Hòa, Dĩ An, Bình Dương'
)}`;

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  website: '',
};

export default function ContactPage() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

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
          phone: '+84-937-543-809',
          email: EMAIL,
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
              <p className={styles.kicker}>Liên hệ Tuấn Rèm</p>
              <h1 className={styles.title}>Liên hệ &amp; đặt lịch tư vấn</h1>
            </div>
            <div className={styles.headAside}>
              <p className={styles.lead}>
                Gửi kích thước cửa hoặc ảnh không gian — Tuấn Rèm tư vấn chất liệu, báo giá may
                đo và hẹn đo đạc tận nhà trong 24 giờ làm việc.
              </p>
              <p className={styles.headNote}>{`Hotline ${PHONE_DISPLAY} · 8:00 – 20:00`}</p>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.channelsSection} aria-label="Kênh liên hệ nhanh">
        <div className={styles.sectionInner}>
          <div className={styles.channelGrid}>
            <a href={PHONE_HREF} className={styles.channel}>
              <span className={styles.channelIcon}>
                <FaPhoneAlt aria-hidden="true" />
              </span>
              <span className={styles.channelLabel}>Hotline</span>
              <span className={styles.channelValue}>{PHONE_DISPLAY}</span>
              <span className={styles.channelHint}>Gọi trực tiếp mỗi ngày, 8:00 – 20:00</span>
              <span className={styles.channelArrow}>
                Gọi ngay
                <FaArrowRight className={styles.channelArrowIcon} aria-hidden="true" />
              </span>
            </a>

            <a
              href={ZALO_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channel}
            >
              <span className={styles.channelIcon}>
                <FaRegCommentDots aria-hidden="true" />
              </span>
              <span className={styles.channelLabel}>Zalo</span>
              <span className={styles.channelValue}>Tuấn Rèm</span>
              <span className={styles.channelHint}>Gửi ảnh cửa, nhận báo giá nhanh</span>
              <span className={styles.channelArrow}>
                Mở Zalo
                <FaArrowRight className={styles.channelArrowIcon} aria-hidden="true" />
              </span>
            </a>

            <a
              href={MAP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channel}
            >
              <span className={styles.channelIcon}>
                <FaMapMarkerAlt aria-hidden="true" />
              </span>
              <span className={styles.channelLabel}>Showroom</span>
              <span className={styles.channelValue}>Dĩ An, Bình Dương</span>
              <span className={styles.channelHint}>Xem vải và phụ kiện thực tế</span>
              <span className={styles.channelArrow}>
                Chỉ đường
                <FaArrowRight className={styles.channelArrowIcon} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} aria-labelledby="contact-form-title">
        <div className={styles.sectionInner}>
          <div className={styles.contactGrid}>
            <div className={styles.infoPane}>
              <div>
                <p className={styles.paneKicker}>Showroom &amp; xưởng</p>
                <h2 className={styles.paneTitle}>Ghé xem vải trực tiếp</h2>
              </div>
              <p className={styles.paneText}>
                Mẫu vải, thanh treo và phụ kiện được trưng bày tại showroom. Mang theo ảnh cửa
                hoặc bản vẽ để được tư vấn ngay tại chỗ.
              </p>

              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <FaMapMarkerAlt className={styles.infoIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoLabel}>Địa chỉ</p>
                    <p className={styles.infoValue}>{ADDRESS}</p>
                  </div>
                </li>
                <li className={styles.infoItem}>
                  <FaPhoneAlt className={styles.infoIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoLabel}>Điện thoại</p>
                    <p className={styles.infoValue}>
                      <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
                    </p>
                  </div>
                </li>
                <li className={styles.infoItem}>
                  <FaEnvelope className={styles.infoIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoLabel}>Email</p>
                    <p className={styles.infoValue}>
                      <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    </p>
                  </div>
                </li>
                <li className={styles.infoItem}>
                  <FaClock className={styles.infoIcon} aria-hidden="true" />
                  <div>
                    <p className={styles.infoLabel}>Giờ làm việc</p>
                    <p className={styles.infoValue}>
                      Thứ Hai – Thứ Bảy: 8:00 – 20:00
                      <br />
                      Chủ Nhật: 9:00 – 18:00
                    </p>
                  </div>
                </li>
              </ul>

              <p className={styles.infoNote}>
                Ngoài giờ làm việc, bạn để lại tin nhắn Zalo — Tuấn Rèm phản hồi vào đầu ngày
                làm việc kế tiếp.
              </p>
            </div>

            <div className={styles.formPane}>
              <p className={styles.paneKicker}>Tư vấn miễn phí</p>
              <h2 id="contact-form-title" className={styles.paneTitle}>
                Gửi yêu cầu tư vấn
              </h2>
              <p className={styles.paneText}>
                Điền thông tin bên dưới, chúng tôi gọi lại trong 24 giờ làm việc để hỏi rõ nhu
                cầu và hẹn lịch đo.
              </p>

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
                  <p className={styles.formNote}>
                    Thông tin chỉ dùng để tư vấn và không chia sẻ cho bên thứ ba.
                  </p>
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
              <p className={styles.paneKicker}>Bản đồ</p>
              <h2 id="contact-map-title" className={styles.mapTitle}>
                Đường đến Tuấn Rèm
              </h2>
              <p className={styles.mapAddress}>{ADDRESS}</p>
            </div>
            <a
              href={MAP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              Mở Google Maps
              <FaArrowRight className={styles.mapLinkIcon} aria-hidden="true" />
            </a>
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
          <p className={styles.ctaKicker}>Cần phản hồi nhanh?</p>
          <h2 id="contact-cta-title" className={styles.ctaTitle}>
            Gọi trực tiếp để được báo giá sơ bộ
          </h2>
          <p className={styles.ctaText}>
            Hotline mở mỗi ngày từ 8:00 đến 20:00. Gọi hoặc nhắn Zalo — Tuấn Rèm tư vấn ngay,
            không cần chờ email.
          </p>
          <div className={styles.ctaActions}>
            <a href={PHONE_HREF} className={styles.ctaPrimary}>
              <FaPhoneAlt aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
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
