import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CategoryCard from './CategoryCard';

const CategoryScroll = ({ categories, productCounts = {} }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!categories || categories.length === 0) {
    return <div className="text-center py-12 text-lg">Chưa có danh mục nào.</div>;
  }

  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-500 max-w-3xl mx-auto mb-10 text-base md:text-lg">
          Rèm cửa không chỉ là một phụ kiện trang trí đơn thuần, mà còn là yếu tố quan trọng tạo nên không gian lý tưởng cho gia đình bạn. Với đa dạng mẫu mã, chất liệu và kiểu dáng, rèm cửa có thể biến đổi hoàn toàn diện mạo của căn phòng, mang lại sự ấm cúng và tinh tế cho ngôi nhà của bạn.
        </p>
        <div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center"
          >
            {categories.map(category => (
              <CategoryCard
                key={category._id}
                category={category}
                productCount={productCounts[category._id] || 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryScroll;