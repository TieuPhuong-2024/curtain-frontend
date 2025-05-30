'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects, getProjectsByType } from '../../lib/api';
import Image from 'next/image';
import { FaSearch, FaHardHat, FaBuilding, FaStar, FaArrowRight } from 'react-icons/fa';
import StructuredData, { createBreadcrumbSchema } from '@/components/StructureData';
import { ROUTES_PATH, SITE_NAME } from '@/utils/constant';

export default function ThiCongLapRemPage() {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [projectTypes, setProjectTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleProjects, setVisibleProjects] = useState(6);
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const allProjects = await getProjects();
        setProjects(allProjects);

        const trulyFeaturedProjects = allProjects.filter(p => p.featured === true);
        setFeaturedProjects(trulyFeaturedProjects);

        const types = [...new Set(allProjects.map(project => project.type))];
        setProjectTypes(types);
      } catch (err) {
        setError('Không thể tải dữ liệu công trình. Vui lòng thử lại sau.');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  const handleFilterChange = async filter => {
    setActiveFilter(filter);
    setLoading(true);

    try {
      let filteredProjects;

      if (filter === 'all') {
        filteredProjects = await getProjects();
      } else {
        filteredProjects = await getProjectsByType(filter);
      }

      setProjects(filteredProjects);
      setLoading(false);
    } catch (err) {
      setError('Không thể lọc dữ liệu. Vui lòng thử lại sau.');
      setLoading(false);
      console.error('Error filtering projects:', err);
    }
  };

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = projects.filter(
    project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.shortDescription &&
        project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleProjects(prevCount => prevCount + projectsPerPage);
  };

  const visibleFilteredProjects = filteredProjects.slice(0, visibleProjects);

  const hasMoreProjects = visibleProjects < filteredProjects.length;

  return (
    <main className="min-h-screen">
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Công Trình - Tuấn Rèm',
          description:
            'Khám phá các công trình lắp đặt rèm cửa tiêu biểu của Tuấn Rèm - Những dự án đã hoàn thành với chất lượng cao và thiết kế đẹp mắt',
          url: `${process.env.NEXT_PUBLIC_URL}/cong-trinh`,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}/${project._id}`,
              item: createArticleSchemaShort({
                title: project.title,
                image: project.thumbnail,
                description: project.shortDescription || project.description,
              }),
            })),
          },
        }}
      />

      {/* Breadcrumbs Structured Data */}
      <StructuredData
        data={createBreadcrumbSchema([
          { name: 'Trang chủ', url: `${process.env.NEXT_PUBLIC_URL}` },
          { name: 'Công trình', url: `${process.env.NEXT_PUBLIC_URL}/${ROUTES_PATH.CONG_TRINH}` }
        ])}
      />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] bg-[#F9F3E0] flex items-center">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <Image
            src="/images/logo-2.png"
            alt="Logo pattern"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-[#6B4F4A]">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Công Trình Đã Thi Công
          </h1>
          <p className="text-lg md:text-xl max-w-3xl opacity-90 leading-relaxed">
            Bộ sưu tập các dự án tiêu biểu mà chúng tôi đã hoàn thành, giúp quý khách hàng có cái
            nhìn trực quan về chất lượng và phong cách làm việc.
          </p>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-[#FFF9F2]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-[#5B3A29] mb-4 md:mb-0 relative after:content-[''] after:absolute after:h-1 after:w-20 after:bg-[#7C5C52] after:bottom-0 after:left-0 after:-mb-2 pb-3">
              Dự Án Nổi Bật
            </h2>
            <Link
              href="#all-projects"
              className="group flex items-center text-[#7C5C52] hover:text-[#5B3A29] transition-colors font-medium"
            >
              Xem tất cả{' '}
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#7C5C52] border-r-transparent"></div>
              <p className="mt-3 text-gray-600">Đang tải dự án nổi bật...</p>
            </div>
          )}

          {!loading && featuredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                >
                  <div className="relative h-64 overflow-hidden">
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaHardHat className="text-gray-400 text-5xl" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center shadow-md">
                        <FaStar className="mr-1.5" /> Nổi bật
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#5B3A29] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {project.shortDescription || project.description}
                    </p>
                    <div className="flex items-center text-gray-600 mb-4 text-sm">
                      <span className="bg-[#EADFCF] text-[#5B3A29] px-2 py-1 rounded-full flex items-center mr-3 border border-[#D4BFA6]">
                        <FaBuilding className="mr-1.5" /> {project.type}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {project.location}
                      </span>
                    </div>
                    <Link
                      href={`/cong-trinh/${project._id}`}
                      className="inline-flex items-center bg-[#7C5C52] text-white px-4 py-2 rounded-lg hover:bg-[#5B3A29] transition shadow-sm"
                    >
                      Xem chi tiết
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && !error && featuredProjects.length === 0 && (
            <div className="text-center py-12 text-gray-600 col-span-full bg-white rounded-xl shadow-sm p-8">
              <FaStar className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-lg">Hiện chưa có dự án nào được đánh dấu là nổi bật.</p>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-[#F9F3E0] text-[#5B3A29] relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md">
              <div className="text-3xl md:text-5xl font-bold mb-1">
                {process.env.NEXT_PUBLIC_PROJECTS_COMPLETED || '200+'}
              </div>
              <div className="mt-2 text-[#7C5C52] font-medium">Dự án đã hoàn thành</div>
            </div>
            <div className="p-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md">
              <div className="text-3xl md:text-5xl font-bold mb-1">
                {process.env.NEXT_PUBLIC_HAPPY_CUSTOMERS || '100+'}
              </div>
              <div className="mt-2 text-[#7C5C52] font-medium">Khách hàng hài lòng</div>
            </div>
            <div className="p-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md">
              <div className="text-3xl md:text-5xl font-bold mb-1">
                {process.env.NEXT_PUBLIC_YEARS_OF_EXPERIENCE || '10+'}
              </div>
              <div className="mt-2 text-[#7C5C52] font-medium">Năm kinh nghiệm</div>
            </div>
            <div className="p-6 rounded-lg bg-white/60 backdrop-blur-sm shadow-md">
              <div className="text-3xl md:text-5xl font-bold mb-1">
                {process.env.NEXT_PUBLIC_TYPES_OF_CURTAINS || '20+'}
              </div>
              <div className="mt-2 text-[#7C5C52] font-medium">Loại rèm cửa</div>
            </div>
          </div>
        </div>
      </section>

      {/* All Projects Section */}
      <section id="all-projects" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#5B3A29] mb-12 text-center relative">
            <span className="relative inline-block">
              Tất Cả Công Trình
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#7C5C52] rounded-full"></span>
            </span>
          </h2>

          {/* Search and filter controls */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-5 justify-between mb-8">
              {/* Search box */}
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm công trình..."
                  className="w-full pl-12 pr-4 py-3 border border-[#D4BFA6] rounded-lg focus:ring-2 focus:ring-[#7C5C52] focus:border-[#7C5C52] shadow-sm"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Project type dropdown (mobile) */}
              <div className="md:hidden">
                <select
                  value={activeFilter}
                  onChange={e => handleFilterChange(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D4BFA6] rounded-lg bg-white focus:ring-2 focus:ring-[#7C5C52] focus:border-[#7C5C52] shadow-sm"
                >
                  <option value="all">Tất cả các loại</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter buttons (desktop) */}
            <div className="hidden md:flex flex-wrap gap-3 justify-center">
              <button
                className={`cursor-pointer rounded-full px-5 py-2.5 font-medium transition-all duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-[#7C5C52] text-white shadow-md'
                    : 'bg-white text-[#7C5C52] border border-[#D4BFA6] hover:border-[#7C5C52]'
                }`}
                onClick={() => handleFilterChange('all')}
              >
                Tất cả
              </button>

              {projectTypes.map(type => (
                <button
                  key={type}
                  className={`cursor-pointer rounded-full px-5 py-2.5 font-medium transition-all duration-200 ${
                    activeFilter === type
                      ? 'bg-[#7C5C52] text-white shadow-md'
                      : 'bg-white text-[#7C5C52] border border-[#D4BFA6] hover:border-[#7C5C52]'
                  }`}
                  onClick={() => handleFilterChange(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Loading and error states */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#7C5C52] border-r-transparent"></div>
              <p className="mt-4 text-gray-600 text-lg">Đang tải dữ liệu...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl p-8 max-w-2xl mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="cursor-pointer mt-2 bg-[#7C5C52] text-white px-6 py-3 rounded-lg hover:bg-[#5B3A29] transition shadow-md"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Projects grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredProjects.length > 0 ? (
                  visibleFilteredProjects.map((project, index) => (
                    <div
                      key={project._id || project.id}
                      className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                    >
                      <div className="relative h-64 overflow-hidden">
                        {project.thumbnail ? (
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index < 3}
                            className="group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FaHardHat className="text-gray-400 text-5xl" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#7C5C52] text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-md">
                            {project.type}
                          </span>
                        </div>
                        {project.featured && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center shadow-md">
                              <FaStar className="mr-1.5" /> Nổi bật
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#5B3A29] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {project.shortDescription || project.description}
                        </p>
                        <div className="flex items-center text-gray-600 mb-4 text-sm">
                          <span className="bg-[#EADFCF] text-[#5B3A29] px-2 py-1 rounded-full flex items-center mr-3 border border-[#D4BFA6]">
                            <FaBuilding className="mr-1.5" /> {project.type}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {project.location}
                          </span>
                        </div>
                        <Link
                          href={`/cong-trinh/${project._id || project.id}`}
                          className="inline-flex items-center bg-[#7C5C52] text-white px-4 py-2 rounded-lg hover:bg-[#5B3A29] transition shadow-sm"
                        >
                          Xem chi tiết
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16 text-gray-600 bg-[#FFF9F2] rounded-xl border border-[#D4BFA6]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto mb-4 text-[#7C5C52]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-lg">Không có công trình nào phù hợp với tìm kiếm của bạn.</p>
                  </div>
                )}
              </div>

              {filteredProjects.length > 0 && hasMoreProjects && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    className="cursor-pointer bg-[#EADFCF] text-[#7C5C52] px-8 py-3 rounded-full hover:bg-[#D4BFA6] transition font-medium shadow-sm inline-flex items-center"
                  >
                    Xem thêm công trình
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Installation process */}
      <section className="mb-16 py-16 bg-[#FFF9F2]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-[#5B3A29] text-center relative">
            <span className="relative inline-block">
              Quy Trình Thi Công Lắp Đặt
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#7C5C52] rounded-full"></span>
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#D4BFA6]">
              <div className="w-16 h-16 bg-[#EADFCF] text-[#7C5C52] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-inner">
                1
              </div>
              <h3 className="font-semibold mb-3 text-center text-[#5B3A29]">Khảo sát và tư vấn</h3>
              <p className="text-gray-600 text-sm text-center">
                Đội ngũ đến tận nơi đo đạc, tư vấn mẫu mã phù hợp với không gian của bạn.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#D4BFA6]">
              <div className="w-16 h-16 bg-[#EADFCF] text-[#7C5C52] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-inner">
                2
              </div>
              <h3 className="font-semibold mb-3 text-center text-[#5B3A29]">
                Báo giá & ký hợp đồng
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Gửi báo giá chi tiết, minh bạch và ký hợp đồng nếu khách hàng đồng ý.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#D4BFA6]">
              <div className="w-16 h-16 bg-[#EADFCF] text-[#7C5C52] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-inner">
                3
              </div>
              <h3 className="font-semibold mb-3 text-center text-[#5B3A29]">Thi công lắp đặt</h3>
              <p className="text-gray-600 text-sm text-center">
                Lắp đặt rèm đúng kỹ thuật, đảm bảo an toàn và vệ sinh sạch sẽ sau khi hoàn thành.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#D4BFA6]">
              <div className="w-16 h-16 bg-[#EADFCF] text-[#7C5C52] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-inner">
                4
              </div>
              <h3 className="font-semibold mb-3 text-center text-[#5B3A29]">
                Nghiệm thu & bàn giao
              </h3>
              <p className="text-gray-600 text-sm text-center">
                Khách hàng kiểm tra, nghiệm thu và được hướng dẫn cách sử dụng sản phẩm.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[#D4BFA6]">
              <div className="w-16 h-16 bg-[#EADFCF] text-[#7C5C52] rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-inner">
                5
              </div>
              <h3 className="font-semibold mb-3 text-center text-[#5B3A29]">Hỗ trợ sau lắp đặt</h3>
              <p className="text-gray-600 text-sm text-center">
                Bảo hành, bảo trì và hỗ trợ kỹ thuật tận tình sau khi bán hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="mb-16 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-[#5B3A29] text-center relative">
            <span className="relative inline-block">
              Khách Hàng Nói Gì Về Chúng Tôi
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-[#7C5C52] rounded-full"></span>
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-[#D4BFA6] hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 rounded-full bg-[#EADFCF] flex items-center justify-center text-[#7C5C52] font-bold mr-4 shadow-sm">
                  NT
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Nguyễn Thành</h4>
                  <div className="text-sm text-gray-500">Biệt thự Vinhomes</div>
                </div>
              </div>
              <div className="flex text-amber-400 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="italic text-gray-700 border-l-4 border-[#D4BFA6] pl-4 py-1">
                "Rèm cửa được lắp rất nhanh, đẹp và đúng ý tôi. Đội ngũ thi công chuyên nghiệp, tư
                vấn tận tình. Tôi rất hài lòng!"
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-[#D4BFA6] hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 rounded-full bg-[#EADFCF] flex items-center justify-center text-[#7C5C52] font-bold mr-4 shadow-sm">
                  LH
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Lê Hương</h4>
                  <div className="text-sm text-gray-500">Chung cư The Vista</div>
                </div>
              </div>
              <div className="flex text-amber-400 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="italic text-gray-700 border-l-4 border-[#D4BFA6] pl-4 py-1">
                "Chất lượng rèm rất tốt, màu sắc đúng như mẫu. Đặc biệt ấn tượng với đội ngũ lắp đặt
                chuyên nghiệp và gọn gàng."
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-[#D4BFA6] hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 rounded-full bg-[#EADFCF] flex items-center justify-center text-[#7C5C52] font-bold mr-4 shadow-sm">
                  PT
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Phạm Tuấn</h4>
                  <div className="text-sm text-gray-500">Văn phòng Quận 1</div>
                </div>
              </div>
              <div className="flex text-amber-400 mb-4">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p className="italic text-gray-700 border-l-4 border-[#D4BFA6] pl-4 py-1">
                "Tôi đã tìm hiểu nhiều nơi và quyết định chọn dịch vụ tại đây. Kết quả hoàn toàn
                xứng đáng, rèm đẹp và chất lượng vượt mong đợi."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <div className="text-center bg-[#F9F3E0] text-[#5B3A29] p-12 rounded-2xl shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Bạn muốn thi công rèm cho công trình của mình?
              </h3>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Hãy liên hệ với chúng tôi để được tư vấn, khảo sát và báo giá miễn phí!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-[#5B3A29] text-white px-8 py-3.5 rounded-full hover:bg-[#7C5C52] transition font-medium shadow-md"
                >
                  Liên hệ ngay
                </Link>
                <Link
                  href="/products"
                  className="bg-transparent text-[#5B3A29] border border-[#5B3A29] px-8 py-3.5 rounded-full hover:bg-[#5B3A291a] transition font-medium"
                >
                  Xem các sản phẩm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
