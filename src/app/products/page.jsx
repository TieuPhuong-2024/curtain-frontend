'use client';

import '../styles/cozy-theme.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurtains, getCategories, getColors } from '@/lib/api';
import CurtainCard from '@/components/CurtainCard';
import { FaFilter, FaTimes } from 'react-icons/fa';
import StructuredData, { createBreadcrumbSchema, createProductSchema } from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [curtains, setCurtains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState(categoryParam || '');
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
    const [categories, setCategories] = useState([]);

    const [colors, setColors] = useState([]); // State for colors

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [curtainsData, categoriesData, colorsData] = await Promise.all([
                    getCurtains(),
                    getCategories(),
                    getColors()
                ]);

                setCurtains(curtainsData);
                setCategories(categoriesData);
                setColors(colorsData || []); // Store colors from database
                setCurtains(curtainsData);
                setCategories(categoriesData);
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (categoryParam) {
            // Find if categoryParam matches a category ID
            const categoryExists = categories.some(cat => cat._id === categoryParam);
            if (categoryExists) {
                setSelectedCategory(categoryParam);
            } else {
                // Find if categoryParam matches a category name
                const category = categories.find(cat => cat.name === categoryParam);
                if (category) {
                    setSelectedCategory(category._id);
                }
            }
        }
    }, [categoryParam, categories]);

    const toggleColorFilter = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedColors([]);
        setPriceRange({ min: 0, max: 10000000 });
    };

    const filteredCurtains = curtains.filter(curtain => {
        // Xử lý trường hợp category có thể là object
        const curtainCategoryId = typeof curtain.category === 'object' ? curtain.category?._id : curtain.category;
        const matchesCategory = selectedCategory === '' || curtainCategoryId === selectedCategory;

        // Xử lý trường hợp color có thể null hoặc case sensitivity
        const curtainColorObject = curtain.color || {}; // curtain.color is an object, provide fallback
        const matchesColor = selectedColors.length === 0 ||
            selectedColors.some(selectedColorName => // selectedColorName is a string from the filter
                curtainColorObject.name?.toLowerCase() === selectedColorName.toLowerCase());

        // const matchesPrice = curtain.price >= priceRange.min && curtain.price <= priceRange.max;
        let matchesPrice = false;
        const price = curtain.price || {};

        switch (price.type) {
            case 'fixed':
                matchesPrice = typeof price.value === 'number' &&
                    price.value >= priceRange.min &&
                    price.value <= priceRange.max;
                break;
            case 'range':
                matchesPrice = typeof price.min === 'number' && typeof price.max === 'number' &&
                    price.max >= priceRange.min &&
                    price.min <= priceRange.max;
                break;
            case 'discount':
                matchesPrice = typeof price.new === 'number' &&
                    price.new >= priceRange.min &&
                    price.new <= priceRange.max;
                break;
            case 'contact':
                matchesPrice = true; // luôn hiển thị nếu là liên hệ
                break;
            default:
                matchesPrice = false;
        }

        return matchesCategory && matchesColor && matchesPrice;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Structured Data */}
            <StructuredData
                data={createBreadcrumbSchema([
                    { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
                    { name: 'Sản phẩm', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}` },
                ])} />
            <StructuredData
                data={{
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: 'Sản phẩm - Tuấn Rèm',
                    description:
                        'Khám phá các mẫu rèm cửa chất lượng cao của Tuấn Rèm – đa dạng kiểu dáng, chất liệu và màu sắc phù hợp cho mọi không gian.',
                    url: `${process.env.NEXT_PUBLIC_URL}/products`,
                    mainEntity: {
                        '@type': 'ItemList',
                        itemListElement: curtains.map((curtain, index) => ({
                            '@type': 'ListItem',
                            position: index + 1,
                            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}/${curtain.id}`,
                            item: createProductSchema({
                                name: curtain.name,
                                description: curtain.description,
                                images: Array.isArray(curtain.images) ? curtain.images : [curtain.images],
                                price: curtain.price,
                                inStock: curtain.inStock,
                                url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}/${curtain.id}`,
                            }),
                        })),
                    },
                }}
            />

            {/* UI */}
            <h1 className="text-3xl font-bold mb-2">Sản Phẩm Rèm Cửa</h1>
            <p className="text-gray-600 mb-8">Khám phá bộ sưu tập rèm cửa đa dạng cho không gian của bạn</p>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filter sidebar - mobile toggle */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md"
                    >
                        {filterOpen ? <FaTimes /> : <FaFilter />} {filterOpen ? 'Đóng bộ lọc' : 'Bộ lọc'}
                    </button>
                </div>

                {/* Filter sidebar */}
                <div
                    className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white p-4 rounded-lg shadow-md`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Bộ lọc</h2>
                        <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline">
                            Xóa tất cả
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Loại rèm</h3>
                        <div className="space-y-1">
                            {categories.map(category => (
                                <div key={category._id} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`category-${category._id}`}
                                        name="category"
                                        checked={selectedCategory === category._id}
                                        onChange={() => setSelectedCategory(category._id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`category-${category._id}`}>{category.name}</label>
                                </div>
                            ))}
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="category-all"
                                    name="category"
                                    checked={selectedCategory === ''}
                                    onChange={() => setSelectedCategory('')}
                                    className="mr-2"
                                />
                                <label htmlFor="category-all">Tất cả</label>
                            </div>
                        </div>
                    </div>

                    {/* Color Filters */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700">Màu sắc</h3>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color._id}
                                    onClick={() => {
                                        if (selectedColors.includes(color.name)) {
                                            setSelectedColors(selectedColors.filter(c => c !== color.name));
                                        } else {
                                            setSelectedColors([...selectedColors, color.name]);
                                        }
                                    }}
                                    className={`px-3 py-1 rounded-full text-sm ${selectedColors.includes(color.name)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                        <h3 className="font-medium mb-2">Khoảng giá (VNĐ)</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="10000000"
                                step="500000"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-sm">
                                <span>0₫</span>
                                <span>{new Intl.NumberFormat('vi-VN').format(priceRange.max)}₫</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div
                                className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
                    ) : filteredCurtains.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm phù hợp với bộ lọc.</p>
                            <button onClick={clearFilters} className="text-indigo-600 font-medium hover:underline">
                                Xóa bộ lọc
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCurtains.map((curtain) => (
                                <CurtainCard key={curtain._id} curtain={curtain} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 