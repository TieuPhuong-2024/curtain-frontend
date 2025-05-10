'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProjects, getProjectsByType } from "../../lib/api";
import Image from "next/image";
import { FaSearch, FaHardHat, FaBuilding, FaStar, FaArrowRight } from "react-icons/fa";


export default function ThiCongLapRemPage() {
    const [projects, setProjects] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [projectTypes, setProjectTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
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
                setError("Không thể tải dữ liệu công trình. Vui lòng thử lại sau.");
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectsData();
    }, []);

    const handleFilterChange = async (filter) => {
        setActiveFilter(filter);
        setLoading(true);

        try {
            let filteredProjects;

            if (filter === "all") {
                filteredProjects = await getProjects();
            } else {
                filteredProjects = await getProjectsByType(filter);
            }

            setProjects(filteredProjects);
            setLoading(false);
        } catch (err) {
            setError("Không thể lọc dữ liệu. Vui lòng thử lại sau.");
            setLoading(false);
            console.error("Error filtering projects:", err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.shortDescription && project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLoadMore = () => {
        setVisibleProjects(prevCount => prevCount + projectsPerPage);
    };

    const visibleFilteredProjects = filteredProjects.slice(0, visibleProjects);

    const hasMoreProjects = visibleProjects < filteredProjects.length;

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] min-h-[300px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center">
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <Image
                        src="/images/logo.png"
                        alt="Logo pattern"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </div>
                <div className="container mx-auto px-4 z-10 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Công Trình Đã Thi Công</h1>
                    <p className="text-lg md:text-xl max-w-3xl opacity-90">
                        Bộ sưu tập các dự án tiêu biểu mà chúng tôi đã hoàn thành,
                        giúp quý khách hàng có cái nhìn trực quan về chất lượng và phong cách làm việc.
                    </p>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-blue-900">Dự Án Nổi Bật</h2>
                        <Link href="#all-projects" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            Xem tất cả <FaArrowRight className="ml-2" />
                        </Link>
                    </div>

                    {loading && (
                        <div className="text-center py-10">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-2 text-gray-600">Đang tải dự án nổi bật...</p>
                        </div>
                    )}

                    {!loading && featuredProjects.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProjects.map((project, index) => (
                                <div key={project._id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                                    <div className="relative h-60">
                                        {project.thumbnail ? (
                                            <Image
                                                src={project.thumbnail}
                                                alt={project.title}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={index < 3}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <FaHardHat className="text-gray-400 text-4xl" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center">
                                                <FaStar className="mr-1" /> Nổi bật
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                        <p className="text-gray-700 mb-3 line-clamp-2">{project.shortDescription || project.description}</p>
                                        <div className="flex items-center text-gray-600 mb-3">
                                            <FaBuilding className="mr-1" />
                                            <span>{project.type}</span>
                                            <span className="mx-2">•</span>
                                            <span>{project.location}</span>
                                        </div>
                                        <Link href={`/cong-trinh/${project._id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!loading && !error && featuredProjects.length === 0 && (
                        <div className="text-center py-10 text-gray-600 col-span-full">
                            <FaStar className="mx-auto text-3xl text-gray-400 mb-3" />
                            <p>Hiện chưa có dự án nào được đánh dấu là nổi bật.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-10 bg-blue-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="py-4">
                            <div className="text-3xl md:text-4xl font-bold">{process.env.NEXT_PUBLIC_PROJECTS_COMPLETED}</div>
                            <div className="mt-2 text-blue-200">Dự án đã hoàn thành</div>
                        </div>
                        <div className="py-4">
                            <div className="text-3xl md:text-4xl font-bold">{process.env.NEXT_PUBLIC_HAPPY_CUSTOMERS}</div>
                            <div className="mt-2 text-blue-200">Khách hàng hài lòng</div>
                        </div>
                        <div className="py-4">
                            <div className="text-3xl md:text-4xl font-bold">{process.env.NEXT_PUBLIC_YEARS_OF_EXPERIENCE}</div>
                            <div className="mt-2 text-blue-200">Năm kinh nghiệm</div>
                        </div>
                        <div className="py-4">
                            <div className="text-3xl md:text-4xl font-bold">{process.env.NEXT_PUBLIC_TYPES_OF_CURTAINS}</div>
                            <div className="mt-2 text-blue-200">Loại rèm cửa</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* All Projects Section */}
            <section id="all-projects" className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-blue-900 mb-10 text-center">Tất Cả Công Trình</h2>

                    {/* Search and filter controls */}
                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                            {/* Search box */}
                            <div className="relative max-w-md w-full">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm công trình..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>

                            {/* Project type dropdown (mobile) */}
                            <div className="md:hidden">
                                <select
                                    value={activeFilter}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                                >
                                    <option value="all">Tất cả các loại</option>
                                    {projectTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter buttons (desktop) */}
                        <div className="hidden md:flex flex-wrap gap-2 justify-center">
                            <button
                                className={`cursor-pointer ${activeFilter === "all" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-600"} px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition`}
                                onClick={() => handleFilterChange("all")}
                            >
                                Tất cả
                            </button>

                            {projectTypes.map((type) => (
                                <button
                                    key={type}
                                    className={`cursor-pointer ${activeFilter === type ? "bg-blue-600 text-white" : "bg-white text-blue-600 border border-blue-600"} px-4 py-2 rounded-md hover:bg-blue-700 hover:text-white transition`}
                                    onClick={() => handleFilterChange(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading and error states */}
                    {loading && (
                        <div className="text-center py-10">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8 text-red-600">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="cursor-pointer mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
                                        <div key={project._id || project.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                                            <div className="relative h-60">
                                                {project.thumbnail ? (
                                                    <Image
                                                        src={project.thumbnail}
                                                        alt={project.title}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        priority={index < 3}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <FaHardHat className="text-gray-400 text-4xl" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2">
                                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                                                        {project.type}
                                                    </span>
                                                </div>
                                                {project.featured && (
                                                    <div className="absolute top-2 right-2">
                                                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-md font-medium flex items-center">
                                                            <FaStar className="mr-1" /> Nổi bật
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                                <p className="text-gray-700 mb-3 line-clamp-2">{project.shortDescription || project.description}</p>
                                                <div className="flex items-center text-gray-600 mb-3">
                                                    <FaBuilding className="mr-1" />
                                                    <span>{project.type}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{project.location}</span>
                                                </div>
                                                <Link href={`/cong-trinh/${project._id || project.id}`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-8 text-gray-600">
                                        <p>Không có công trình nào phù hợp với tìm kiếm của bạn.</p>
                                    </div>
                                )}
                            </div>

                            {filteredProjects.length > 0 && hasMoreProjects && (
                                <div className="text-center mt-8">
                                    <button
                                        onClick={handleLoadMore}
                                        className="cursor-pointer bg-blue-100 text-blue-700 px-6 py-3 rounded-md hover:bg-blue-200 transition font-medium"
                                    >
                                        Xem thêm công trình
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Installation process */}
            <section className="mb-16 py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Quy Trình Thi Công Lắp Đặt</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                            <h3 className="font-semibold mb-2">Khảo sát và tư vấn</h3>
                            <p className="text-gray-600 text-sm">Đội ngũ đến tận nơi đo đạc, tư vấn mẫu mã phù hợp.</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                            <h3 className="font-semibold mb-2">Báo giá & ký hợp đồng</h3>
                            <p className="text-gray-600 text-sm">Gửi báo giá chi tiết, ký hợp đồng nếu khách hàng đồng ý.</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                            <h3 className="font-semibold mb-2">Thi công lắp đặt</h3>
                            <p className="text-gray-600 text-sm">Lắp đặt rèm đúng kỹ thuật, vệ sinh sạch sẽ sau khi hoàn thành.</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                            <h3 className="font-semibold mb-2">Nghiệm thu & bàn giao</h3>
                            <p className="text-gray-600 text-sm">Khách hàng kiểm tra, nghiệm thu và được hướng dẫn sử dụng.</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">5</div>
                            <h3 className="font-semibold mb-2">Hỗ trợ sau lắp đặt</h3>
                            <p className="text-gray-600 text-sm">Bảo hành, hỗ trợ kỹ thuật tận tình sau bán hàng.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Reviews */}
            <section className="mb-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-blue-900 text-center">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                                    NT
                                </div>
                                <div>
                                    <h4 className="font-semibold">Nguyễn Thành</h4>
                                    <div className="text-sm text-gray-500">Biệt thự Vinhomes</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 mb-3">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <p className="italic text-gray-700">"Rèm cửa được lắp rất nhanh, đẹp và đúng ý tôi. Đội ngũ thi công chuyên nghiệp, tư vấn tận tình. Tôi rất hài lòng!"</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                                    LH
                                </div>
                                <div>
                                    <h4 className="font-semibold">Lê Hương</h4>
                                    <div className="text-sm text-gray-500">Chung cư The Vista</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 mb-3">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <p className="italic text-gray-700">"Chất lượng rèm rất tốt, màu sắc đúng như mẫu. Đặc biệt ấn tượng với đội ngũ lắp đặt chuyên nghiệp và gọn gàng."</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                                    PT
                                </div>
                                <div>
                                    <h4 className="font-semibold">Phạm Tuấn</h4>
                                    <div className="text-sm text-gray-500">Văn phòng Quận 1</div>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 mb-3">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>
                            <p className="italic text-gray-700">"Tôi đã tìm hiểu nhiều nơi và quyết định chọn dịch vụ tại đây. Kết quả hoàn toàn xứng đáng, rèm đẹp và chất lượng vượt mong đợi."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="mb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center bg-gradient-to-r from-blue-900 to-blue-700 text-white p-10 rounded-lg shadow-md">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-3">Bạn muốn thi công rèm cho công trình của mình?</h3>
                            <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">Hãy liên hệ với chúng tôi để được tư vấn, khảo sát và báo giá miễn phí!</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact"
                                    className="bg-white text-blue-700 px-6 py-3 rounded-md hover:bg-blue-50 transition font-medium">
                                    Liên hệ ngay
                                </Link>
                                <Link href="/products"
                                    className="bg-transparent text-white border border-white px-6 py-3 rounded-md hover:bg-white/10 transition font-medium">
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
