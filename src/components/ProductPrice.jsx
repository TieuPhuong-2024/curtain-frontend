export default function ProductPrice({ price }) {
    if (!price) return null;
    switch (price.type) {
        case 'fixed':
            return <span>{price.value.toLocaleString('vi-VN')}₫</span>;
        case 'range':
            return <span>{price.min.toLocaleString('vi-VN')}₫ - {price.max.toLocaleString('vi-VN')}₫</span>;
        case 'contact':
            return <span>Liên hệ</span>;
        case 'discount':
            return (
                <span>
                    <del className="text-gray-400">{price.old.toLocaleString('vi-VN')}₫</del>
                    <span className="ml-1">{price.new.toLocaleString('vi-VN')}₫</span>
                </span>
            );
        default:
            return null;
    }
}