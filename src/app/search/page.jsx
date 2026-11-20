'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';
import { getCategories, getColors, getCurtains, getPosts, getProjects } from '@/lib/api';
import CurtainCard from '@/components/CurtainCard';
import ProjectListCard from '@/components/projects/ProjectListCard';
import PostListCard from '@/components/posts/PostListCard';

const MAX_PRICE = 10000000;

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesQuery(fields, normalizedTokens) {
  if (normalizedTokens.length === 0) return true;
  const haystack = normalizeText(fields.filter(Boolean).join(' '));
  return normalizedTokens.every((token) => haystack.includes(token));
}

function matchesCurtainPrice(price, min, max) {
  const isDefaultRange = min <= 0 && max >= MAX_PRICE;
  if (isDefaultRange) return true;
  if (!price) return false;

  if (typeof price === 'number') {
    return price >= min && price <= max;
  }

  if (typeof price === 'object') {
    if (price.type === 'contact') return false;
    if (price.type === 'range') {
      const low = Number(price.min) || 0;
      const high = Number(price.max) || low;
      return high >= min && low <= max;
    }
    const numeric =
      price.type === 'discount' ? Number(price.new) : Number(price.value);
    if (!Number.isFinite(numeric)) return false;
    return numeric >= min && numeric <= max;
  }

  return false;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(query);
  const [activeTab, setActiveTab] = useState('all');

  const [curtains, setCurtains] = useState([]);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: MAX_PRICE });

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [curtainsRes, categoriesRes, colorsRes, projectsRes, postsRes] =
          await Promise.allSettled([
            getCurtains(),
            getCategories(),
            getColors(),
            getProjects(),
            getPosts(1, 100, 'published'),
          ]);

        if (ignore) return;

        if (curtainsRes.status === 'fulfilled' && Array.isArray(curtainsRes.value)) {
          setCurtains(curtainsRes.value);
        }
        if (categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value)) {
          setCategories(categoriesRes.value);
        }
        if (colorsRes.status === 'fulfilled' && Array.isArray(colorsRes.value)) {
          setColors(colorsRes.value);
        }
        if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value)) {
          setProjects(projectsRes.value.filter((p) => p.published !== false));
        }
        if (postsRes.status === 'fulfilled') {
          const postList = Array.isArray(postsRes.value)
            ? postsRes.value
            : Array.isArray(postsRes.value?.posts)
              ? postsRes.value.posts
              : [];
          setPosts(postList.filter((p) => !p.status || p.status === 'published'));
        }
      } catch (err) {
        if (!ignore) {
          setError('Không thể tải dữ liệu tìm kiếm. Vui lòng thử lại sau.');
          console.error(err);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  const queryTokens = useMemo(() => {
    const normalized = normalizeText(query);
    return normalized ? normalized.split(' ') : [];
  }, [query]);

  const filteredCurtains = useMemo(() => {
    return curtains.filter((curtain) => {
      const categoryObj = typeof curtain.category === 'object' ? curtain.category : null;
      const colorObj = typeof curtain.color === 'object' ? curtain.color : null;
      const categoryId = categoryObj ? categoryObj._id : curtain.category;
      const colorId = colorObj ? colorObj._id : curtain.color;

      const textMatch = matchesQuery(
        [curtain.name, curtain.description, curtain.material, categoryObj?.name, colorObj?.name],
        queryTokens
      );
      if (!textMatch) return false;

      if (selectedCategory && categoryId !== selectedCategory) return false;
      if (selectedColor && colorId !== selectedColor) return false;

      return matchesCurtainPrice(curtain.price, priceRange.min, priceRange.max);
    });
  }, [curtains, queryTokens, selectedCategory, selectedColor, priceRange]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) =>
      matchesQuery(
        [project.title, project.shortDescription, project.location, project.type],
        queryTokens
      )
    );
  }, [projects, queryTokens]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      matchesQuery(
        [post.title, post.summary, ...(Array.isArray(post.tags) ? post.tags : [])],
        queryTokens
      )
    );
  }, [posts, queryTokens]);

  const totalCount = filteredCurtains.length + filteredProjects.length + filteredPosts.length;
  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedColor) ||
    priceRange.min > 0 ||
    priceRange.max < MAX_PRICE;

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedColor('');
    setPriceRange({ min: 0, max: MAX_PRICE });
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  const tabs = [
    { id: 'all', label: 'Tất cả', count: totalCount },
    { id: 'products', label: 'Sản phẩm', count: filteredCurtains.length },
    { id: 'projects', label: 'Công trình', count: filteredProjects.length },
    { id: 'posts', label: 'Bài viết', count: filteredPosts.length },
  ];

  const showProducts = activeTab === 'all' || activeTab === 'products';
  const showProjects = activeTab === 'all' || activeTab === 'projects';
  const showPosts = activeTab === 'all' || activeTab === 'posts';

  return (
    <div className="container mx-auto max-w-[1320px] px-4 py-12 md:py-16">
      <div className="mb-8 border-b border-[#3f2f22]/15 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a67c52]">
          Tìm kiếm
        </p>
        <h1 className="mt-2 font-[var(--font-display)] text-3xl font-medium text-[#231b14] md:text-4xl">
          {query ? `Kết quả cho "${query}"` : 'Tìm kiếm rèm, công trình & bài viết'}
        </h1>

        <form onSubmit={handleSubmitSearch} className="mt-5 flex max-w-xl gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tên rèm, chất liệu, công trình hoặc bài viết..."
              className="w-full rounded-full border border-[#3f2f22]/20 bg-[#fffaf6] py-2.5 pl-4 pr-10 text-sm text-[#231b14] placeholder:text-[#7d6e5d] focus:border-[#a67c52] focus:outline-none"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  router.push('/search');
                }}
                aria-label="Xóa từ khóa"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d6e5d] hover:text-[#231b14]"
              >
                <FaTimes size={13} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-[#231b14] px-5 py-2.5 text-sm font-medium text-[#fffaf6] transition-colors hover:bg-[#a67c52]"
          >
            <FaSearch size={13} />
            <span>Tìm</span>
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Loại kết quả">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#231b14] text-[#fffaf6]'
                      : 'border border-[#3f2f22]/15 bg-[#fffaf6] text-[#5b4636] hover:border-[#a67c52]'
                  }`}
                >
                  {tab.label} <span className="ml-1 opacity-75">({tab.count})</span>
                </button>
              );
            })}
          </div>

          {showProducts && (
            <button
              type="button"
              onClick={() => setFilterOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-[#3f2f22]/20 bg-[#fffaf6] px-4 py-1.5 text-sm font-medium text-[#3f2f22] lg:hidden"
            >
              <FaFilter size={12} />
              <span>Lọc sản phẩm</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#3f2f22]/20 border-t-[#a67c52]" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          {showProducts && (
            <aside className={`${filterOpen ? 'block' : 'hidden'} w-full flex-shrink-0 lg:block lg:w-64`}>
              <div className="rounded-2xl border border-[#3f2f22]/12 bg-[#fffaf6] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#231b14]">Lọc sản phẩm</h2>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-medium text-[#a67c52] hover:underline"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>

                <div className="mb-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#7d6e5d]">
                    Danh mục
                  </label>
                  <select
                    className="w-full rounded-lg border border-[#3f2f22]/20 bg-white p-2 text-sm text-[#231b14]"
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

                {colors.length > 0 && (
                  <div className="mb-5">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#7d6e5d]">
                      Màu sắc
                    </label>
                    <select
                      className="w-full rounded-lg border border-[#3f2f22]/20 bg-white p-2 text-sm text-[#231b14]"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Tất cả màu</option>
                      {colors.map((color) => (
                        <option key={color._id} value={color._id}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#7d6e5d]">
                    Giá tối đa: {new Intl.NumberFormat('vi-VN').format(priceRange.max)}đ
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={MAX_PRICE}
                    step="100000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({ ...prev, max: Number(e.target.value) }))
                    }
                    className="w-full accent-[#a67c52]"
                  />
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1 space-y-12">
            {totalCount === 0 ? (
              <div className="rounded-2xl border border-[#3f2f22]/12 bg-[#fffaf6] p-10 text-center">
                <h2 className="text-xl font-semibold text-[#231b14]">
                  Không tìm thấy kết quả phù hợp
                </h2>
                <p className="mt-2 text-sm text-[#7d6e5d]">
                  Thử từ khóa ngắn hơn (ví dụ: &ldquo;rèm vải&rdquo;, &ldquo;chống nắng&rdquo;,
                  &ldquo;voan&rdquo;) hoặc xem toàn bộ danh mục sản phẩm.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-full border border-[#3f2f22]/20 px-5 py-2 text-sm font-medium text-[#231b14] hover:border-[#a67c52]"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                  <Link
                    href="/products"
                    className="rounded-full bg-[#231b14] px-5 py-2 text-sm font-medium text-[#fffaf6] hover:bg-[#a67c52]"
                  >
                    Xem tất cả sản phẩm
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {showProducts && filteredCurtains.length > 0 && (
                  <section aria-labelledby="search-products-heading">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h2
                        id="search-products-heading"
                        className="font-[var(--font-display)] text-2xl font-medium text-[#231b14]"
                      >
                        Sản phẩm ({filteredCurtains.length})
                      </h2>
                      <Link href="/products" className="text-sm text-[#a67c52] hover:underline">
                        Xem tất cả
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCurtains.map((curtain) => (
                        <CurtainCard key={curtain._id} curtain={curtain} />
                      ))}
                    </div>
                  </section>
                )}

                {showProjects && filteredProjects.length > 0 && (
                  <section aria-labelledby="search-projects-heading">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h2
                        id="search-projects-heading"
                        className="font-[var(--font-display)] text-2xl font-medium text-[#231b14]"
                      >
                        Công trình ({filteredProjects.length})
                      </h2>
                      <Link href="/cong-trinh" className="text-sm text-[#a67c52] hover:underline">
                        Xem tất cả
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredProjects.map((project) => (
                        <ProjectListCard key={project._id} project={project} />
                      ))}
                    </div>
                  </section>
                )}

                {showPosts && filteredPosts.length > 0 && (
                  <section aria-labelledby="search-posts-heading">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h2
                        id="search-posts-heading"
                        className="font-[var(--font-display)] text-2xl font-medium text-[#231b14]"
                      >
                        Bài viết ({filteredPosts.length})
                      </h2>
                      <Link href="/posts" className="text-sm text-[#a67c52] hover:underline">
                        Xem tất cả
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredPosts.map((post) => (
                        <PostListCard key={post._id} post={post} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
