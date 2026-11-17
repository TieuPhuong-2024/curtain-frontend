import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import styles from '@/styles/modules/CategoryCard.module.css';

const CategoryCard = ({ category, productCount = 0 }) => {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.name)}`}
      className={styles.card}
    >
      <Image
        src={category.image || '/images/curtain-placeholder.jpg'}
        alt={category.name}
        fill
        sizes="(max-width: 600px) 78vw, (max-width: 1024px) 40vw, 320px"
        className={styles.image}
      />
      <span className={styles.scrim} aria-hidden="true" />
      <span className={styles.arrowIcon} aria-hidden="true">
        <FaArrowRight size={12} />
      </span>
      <div className={styles.content}>
        <span className={styles.count}>
          {productCount > 0 ? `${productCount} sản phẩm` : 'Sắp ra mắt'}
        </span>
        <h3 className={styles.title}>{category.name}</h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
