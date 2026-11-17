'use client';

import '../styles/cozy-theme.css';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCurtains, getCategories, getColors } from '@/lib/api';
import CurtainCard from '@/components/CurtainCard';
import { FaFilter, FaTimes } from 'react-icons/fa';
import StructuredData, { createBreadcrumbSchema, createProductSchema } from '@/components/StructureData';
import { ROUTES_PATH } from '@/utils/constant';
import styles from '@/styles/modules/Products.module.css';

const MAX_PRICE = 10000000;

const formatPrice = (value) => `${new Intl.NumberFormat('vi-VN').format(value)}₫`;

const getCategoryId = (curtain) =>
    typeof curtain.category === 'object' ? curtain.category?._id : curtain.category;

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');

    const [curtains, setCurtains] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: MAX_PRICE });

    useEffect(() => {
        let ignore = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [curtainsData, categoriesData, colorsData] = await Promise.all([
                    getCurtains(),
                    getCategories(),
                    getColors(),
                ]);
                if (ignore) return;
                setCurtains(curtainsData || []);
                setCategories(categoriesData || []);
                setColors(colorsData || []);
            } catch (err) {
                if (ignore) return;
                console.error(err);
                setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchData();
        return () => {
            ignore = true;
        };
    }, [reloadKey]);

    useEffect(() => {
        if (!categoryParam) return;
        const byId = categories.find(cat => cat._id === categoryParam);
        if (byId) {
            setSelectedCategory(byId._id);
            return;
        }
        const byName = categories.find(cat => cat.name === categoryParam);
        if (byName) setSelectedCategory(byName._id);
    }, [categoryParam, categories]);

    const categoryCounts = useMemo(() => {
        const counts = {};
        curtains.forEach(curtain => {
            const id = getCategoryId(curtain);
            if (id) counts[id] = (counts[id] || 0) + 1;
        });
        return counts;
    }, [curtains]);

    const filteredCurtains = useMemo(() => {
        return curtains.filter(curtain => {
            const matchesCategory = selectedCategory === '' || getCategoryId(curtain) === selectedCategory;

            const curtainColor = curtain.color || {};
            const matchesColor = selectedColors.length === 0 ||
                selectedColors.some(name => curtainColor.name?.toLowerCase() === name.toLowerCase());

            const price = curtain.price || {};
            let matchesPrice = false;
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
                    matchesPrice = true;
                    break;
                default:
                    matchesPrice = false;
            }

            return matchesCategory && matchesColor && matchesPrice;
        });
    }, [curtains, selectedCategory, selectedColors, priceRange]);

    const selectedCategoryName = categories.find(cat => cat._id === selectedCategory)?.name || '';
    const isPriceFiltered = priceRange.max < MAX_PRICE;
    const activeFilterCount = (selectedCategory ? 1 : 0) + selectedColors.length + (isPriceFiltered ? 1 : 0);
    const priceFill = `${Math.round((priceRange.max / MAX_PRICE) * 100)}%`;

    const toggleColorFilter = (name) => {
        setSelectedColors(prev =>
            prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
        );
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedColors([]);
        setPriceRange({ min: 0, max: MAX_PRICE });
    };

    return (
        <div className={styles.page}>
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
                            url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}/${curtain._id}`,
                            item: createProductSchema({
                                name: curtain.name,
                                description: curtain.description,
                                images: Array.isArray(curtain.images) ? curtain.images : [curtain.images],
                                price: curtain.price,
                                inStock: curtain.inStock,
                                url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.PRODUCTS}/${curtain._id}`,
                            }),
                        })),
                    },
                }}
            />

            <header className={styles.pageHead}>
                <div className={styles.headInner}>
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link href="/">Trang chủ</Link>
                        <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
                        <span aria-current="page">Sản phẩm</span>
                    </nav>
                    <div className={styles.headGrid}>
                        <div>
                            <p className={styles.kicker}>Bộ sưu tập</p>
                            <h1 className={styles.title}>Sản phẩm rèm cửa</h1>
                        </div>
                        <div className={styles.headAside}>
                            <p className={styles.lead}>
                                Rèm voan, rèm blackout, rèm cuốn — may đo theo từng ô cửa,
                                tư vấn chất liệu và màu sắc ngay tại nhà.
                            </p>
                            <p className={styles.headNote}>Đo &amp; lắp tận nơi · Bình Dương &amp; TP.HCM</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.bodyInner}>
                <div className={styles.layout}>
                    <aside
                        id="product-filters"
                        className={`${styles.sidebar} ${filterOpen ? styles.sidebarOpen : ''}`}
                    >
                        <div className={styles.sidebarHead}>
                            <h2 className={styles.sidebarTitle}>Bộ lọc</h2>
                            <button
                                type="button"
                                className={styles.resetButton}
                                onClick={clearFilters}
                                disabled={activeFilterCount === 0}
                            >
                                Đặt lại
                            </button>
                        </div>

                        <div className={styles.filterGroup} role="group" aria-labelledby="filter-category">
                            <h3 id="filter-category" className={styles.filterTitle}>Loại rèm</h3>
                            {loading ? (
                                <div aria-hidden="true">
                                    <span className={styles.skeletonSidebarLine} />
                                    <span className={styles.skeletonSidebarLine} />
                                    <span className={styles.skeletonSidebarLine} />
                                    <span className={styles.skeletonSidebarLine} />
                                </div>
                            ) : (
                                <div className={styles.optionList}>
                                    <label className={`${styles.option} ${selectedCategory === '' ? styles.optionActive : ''}`}>
                                        <input
                                            type="radio"
                                            name="category"
                                            className={styles.radioInput}
                                            checked={selectedCategory === ''}
                                            onChange={() => setSelectedCategory('')}
                                        />
                                        <span className={styles.radioMark} aria-hidden="true" />
                                        <span className={styles.optionLabel}>Tất cả</span>
                                        <span className={styles.optionCount}>{curtains.length}</span>
                                    </label>
                                    {categories.map(category => (
                                        <label
                                            key={category._id}
                                            className={`${styles.option} ${selectedCategory === category._id ? styles.optionActive : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                className={styles.radioInput}
                                                checked={selectedCategory === category._id}
                                                onChange={() => setSelectedCategory(category._id)}
                                            />
                                            <span className={styles.radioMark} aria-hidden="true" />
                                            <span className={styles.optionLabel}>{category.name}</span>
                                            <span className={styles.optionCount}>{categoryCounts[category._id] || 0}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.filterGroup} role="group" aria-labelledby="filter-color">
                            <h3 id="filter-color" className={styles.filterTitle}>Màu sắc</h3>
                            {loading ? (
                                <div aria-hidden="true">
                                    <span className={styles.skeletonSidebarLine} />
                                    <span className={styles.skeletonSidebarLine} />
                                </div>
                            ) : colors.length === 0 ? (
                                <p className={styles.filterEmpty}>Đang cập nhật màu sắc.</p>
                            ) : (
                                <div className={styles.colorList}>
                                    {colors.map(color => {
                                        const active = selectedColors.includes(color.name);
                                        return (
                                            <button
                                                key={color._id}
                                                type="button"
                                                className={`${styles.colorChip} ${active ? styles.colorChipActive : ''}`}
                                                aria-pressed={active}
                                                onClick={() => toggleColorFilter(color.name)}
                                            >
                                                <span
                                                    className={styles.colorSwatch}
                                                    style={{ backgroundColor: color.hexCode || '#c9bda9' }}
                                                    aria-hidden="true"
                                                />
                                                {color.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className={styles.filterGroup} role="group" aria-labelledby="filter-price">
                            <h3 id="filter-price" className={styles.filterTitle}>Giá tối đa</h3>
                            <input
                                id="price-range"
                                type="range"
                                min="0"
                                max={MAX_PRICE}
                                step="500000"
                                value={priceRange.max}
                                aria-label="Giá tối đa"
                                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                className={styles.range}
                                style={{ '--fill': priceFill }}
                            />
                            <div className={styles.rangeMeta}>
                                <span>0₫</span>
                                <strong>{isPriceFiltered ? `Dưới ${formatPrice(priceRange.max)}` : 'Tất cả mức giá'}</strong>
                            </div>
                        </div>
                    </aside>

                    <section className={styles.results} aria-label="Danh sách sản phẩm">
                        <div className={styles.toolbar}>
                            <p className={styles.resultCount}>
                                {loading ? (
                                    'Đang tải bộ sưu tập'
                                ) : (
                                    <>
                                        <strong>{filteredCurtains.length}</strong>
                                        mẫu rèm
                                    </>
                                )}
                            </p>
                            <button
                                type="button"
                                className={styles.filterToggle}
                                onClick={() => setFilterOpen(open => !open)}
                                aria-expanded={filterOpen}
                                aria-controls="product-filters"
                            >
                                {filterOpen ? <FaTimes aria-hidden="true" /> : <FaFilter aria-hidden="true" />}
                                <span>{filterOpen ? 'Đóng bộ lọc' : 'Bộ lọc'}</span>
                                {activeFilterCount > 0 && (
                                    <span className={styles.filterBadge}>{activeFilterCount}</span>
                                )}
                            </button>
                        </div>

                        {activeFilterCount > 0 && (
                            <div className={styles.activeBar}>
                                {selectedCategory && (
                                    <button
                                        type="button"
                                        className={styles.chip}
                                        onClick={() => setSelectedCategory('')}
                                        aria-label={`Bỏ lọc loại rèm ${selectedCategoryName}`}
                                    >
                                        {selectedCategoryName}
                                        <FaTimes className={styles.chipIcon} aria-hidden="true" />
                                    </button>
                                )}
                                {selectedColors.map(name => (
                                    <button
                                        key={name}
                                        type="button"
                                        className={styles.chip}
                                        onClick={() => toggleColorFilter(name)}
                                        aria-label={`Bỏ lọc màu ${name}`}
                                    >
                                        {name}
                                        <FaTimes className={styles.chipIcon} aria-hidden="true" />
                                    </button>
                                ))}
                                {isPriceFiltered && (
                                    <button
                                        type="button"
                                        className={styles.chip}
                                        onClick={() => setPriceRange({ min: 0, max: MAX_PRICE })}
                                        aria-label="Bỏ lọc giá"
                                    >
                                        Dưới {formatPrice(priceRange.max)}
                                        <FaTimes className={styles.chipIcon} aria-hidden="true" />
                                    </button>
                                )}
                                <button type="button" className={styles.clearLink} onClick={clearFilters}>
                                    Xóa tất cả
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className={styles.skeletonGrid} aria-hidden="true">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div key={index} className={styles.skeletonCard}>
                                        <span className={styles.skeletonImage} />
                                        <span className={styles.skeletonLine} />
                                        <span className={styles.skeletonLineShort} />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className={styles.statePanel}>
                                <h2 className={styles.stateTitle}>Không tải được sản phẩm</h2>
                                <p className={styles.stateText}>{error}</p>
                                <div className={styles.stateActions}>
                                    <button
                                        type="button"
                                        className={styles.stateButton}
                                        onClick={() => setReloadKey(key => key + 1)}
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        ) : filteredCurtains.length === 0 ? (
                            <div className={styles.statePanel}>
                                {curtains.length === 0 ? (
                                    <>
                                        <h2 className={styles.stateTitle}>Bộ sưu tập đang được cập nhật</h2>
                                        <p className={styles.stateText}>
                                            Gọi hoặc nhắn Zalo để xem catalogue và hẹn đo tại nhà.
                                        </p>
                                        <div className={styles.stateActions}>
                                            <a href="tel:+84937543809" className={styles.stateButton}>
                                                Gọi 0937 543 809
                                            </a>
                                            <a
                                                href="https://zalo.me/0937543809"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.stateButtonGhost}
                                            >
                                                Nhắn Zalo
                                            </a>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h2 className={styles.stateTitle}>Chưa có mẫu phù hợp</h2>
                                        <p className={styles.stateText}>
                                            Thử nới rộng khoảng giá hoặc bỏ bớt bộ lọc để xem thêm mẫu rèm.
                                        </p>
                                        <div className={styles.stateActions}>
                                            <button type="button" className={styles.stateButton} onClick={clearFilters}>
                                                Xóa bộ lọc
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {filteredCurtains.map(curtain => (
                                    <CurtainCard key={curtain._id} curtain={curtain} variant="editorial" />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
