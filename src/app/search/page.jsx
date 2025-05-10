'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurtains, getCategories } from '@/lib/api';
import CurtainCard from '@/components/CurtainCard';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [curtains, setCurtains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredCurtains, setFilteredCurtains] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
    const [categories, setCategories] = useState([]);

    const colors = [
        'Trắng', 'Đen', 'Xám', 'Be', 'Nâu', 'Xanh dương', 'Xanh lá', 'Đỏ', 'Vàng', 'Hồng'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [curtainsData, categoriesData] = await Promise.all([
                    getCurtains(),
                    getCategories()
                ]);
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

    // Filter products whenever filters or search query changes
    useEffect(() => {
        if (!curtains) return;

        const filtered = curtains.filter(curtain => {
            const matchesSearch = !query || 
                curtain.name?.toLowerCase().includes(query.toLowerCase()) ||
                curtain.description?.toLowerCase().includes(query.toLowerCase());
            
            const matchesCategory = !selectedCategory || 
                (typeof curtain.category === 'object' ? 
                    curtain.category?._id === selectedCategory : 
                    curtain.category === selectedCategory);
            
            const matchesColor = selectedColors.length === 0 || 
                (curtain.colors && curtain.colors.some(color => selectedColors.includes(color)));
            
            const matchesPrice = 
                (!priceRange.min || (curtain.price && curtain.price >= priceRange.min)) && 
                (!priceRange.max || (curtain.price && curtain.price <= priceRange.max));
            
            return matchesSearch && matchesCategory && matchesColor && matchesPrice;
        });

        setFilteredCurtains(filtered);
    }, [curtains, query, selectedCategory, selectedColors, priceRange]);

    const toggleColor = (color) => {
        setSelectedColors(prev => 
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedColors([]);
        setPriceRange({ min: 0, max: 10000000 });
    };

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <h1 className="text-3xl font-bold mb-6">Kết quả tìm kiếm: "{query}"</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filter Sidebar - Desktop */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Lọc sản phẩm</h3>
                        
                        {/* Categories */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Danh mục</h4>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">Tất cả danh mục</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Colors */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Màu sắc</h4>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => toggleColor(color)}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            selectedColors.includes(color)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-2">Khoảng giá</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Tối thiểu"
                                        className="w-full p-2 border rounded-md"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Tối đa"
                                        className="w-full p-2 border rounded-md"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={clearFilters}
                            className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
                
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setFilterOpen(true)}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
                    >
                        <FaFilter /> Lọc sản phẩm
                    </button>
                </div>
                
                {/* Mobile Filter Sidebar */}
                {filterOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
                        <div className="absolute right-0 top-0 h-full w-80 bg-white p-5 overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">Lọc sản phẩm</h3>
                                <button onClick={() => setFilterOpen(false)} className="text-gray-500">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                            
                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-2">Danh mục</h4>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Colors */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-2">Màu sắc</h4>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => toggleColor(color)}
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                selectedColors.includes(color)
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-2">Khoảng giá</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Tối thiểu"
                                            className="w-full p-2 border rounded-md"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Tối đa"
                                            className="w-full p-2 border rounded-md"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={clearFilters}
                                    className="py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                                <button 
                                    onClick={() => setFilterOpen(false)}
                                    className="py-2 bg-primary text-white hover:bg-primary-dark rounded-md transition-colors"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
                    ) : filteredCurtains.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">Không tìm thấy sản phẩm phù hợp.</p>
                            {Object.values(selectedCategory).length > 0 || selectedColors.length > 0 || priceRange.min > 0 || priceRange.max < 10000000 ? (
                                <button onClick={clearFilters} className="text-primary font-medium hover:underline">
                                    Xóa bộ lọc
                                </button>
                            ) : (
                                <Link href="/products" className="text-primary font-medium hover:underline">
                                    Xem tất cả sản phẩm
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="mb-6 text-gray-600">Tìm thấy {filteredCurtains.length} sản phẩm</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCurtains.map((curtain) => (
                                    <CurtainCard key={curtain._id} curtain={curtain}/>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 