import Image from 'next/image';
import Link from 'next/link';

const CategoryCard = ({ category, productCount = 0 }) => {
  return (
    <Link 
      href={`/products?category=${category.name}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100 w-full h-full mx-auto"
      style={{ textDecoration: 'none' }}
    >
      <div className="relative w-full aspect-[4/5] bg-gray-50">
        <Image
          src={category.image || '/images/curtain-placeholder.jpg'}
          alt={category.name}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 300px"
        />
      </div>
      <div className="p-4 sm:p-6 flex flex-col items-center">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 text-center tracking-tight">
          {category.name}
        </h3>
        <span className="block text-xs sm:text-sm md:text-base text-gray-500 mb-1 text-center">
          {productCount > 0 ? `${productCount} sản phẩm` : 'Sắp ra mắt'}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;