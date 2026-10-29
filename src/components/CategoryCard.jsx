import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/modules/CategoryCard.module.css';

const CategoryCard = ({ category, productCount = 0 }) => {
  return (
    <Link 
      href={`/products?category=${category.name}`}
      className={styles.card}
      style={{ textDecoration: 'none' }}
    >
      <div className={styles.imageContainer}>
        <Image
          src={category.image || '/images/curtain-placeholder.jpg'}
          alt={category.name}
          fill
          style={{ objectFit: 'cover' }}
          className={styles.image}
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 300px"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {category.name}
        </h3>
        <span className={styles.count}>
          {productCount > 0 ? `${productCount} sản phẩm` : 'Sắp ra mắt'}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;