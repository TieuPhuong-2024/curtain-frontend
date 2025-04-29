'use client';

import React, { useState, useEffect } from "react";
import ProjectCard from "@/components/ProjectCard";
import axios from "axios";
import Link from "next/link";

export default function ThiCongLapRemPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [projectTypes, setProjectTypes] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/projects');
                setProjects(response.data);

                // Extract unique project types for filters
                const types = [...new Set(response.data.map(project => project.type))];
                setProjectTypes(types);

                setLoading(false);
            } catch (err) {
                setError("Không thể tải dữ liệu công trình. Vui lòng thử lại sau.");
                setLoading(false);
                console.error("Error fetching projects:", err);
            }
        };

        fetchProjects();
    }, []);

    const handleFilterChange = async (filter) => {
        setActiveFilter(filter);
        setLoading(true);

        try {
            let response;

            if (filter === "all") {
                response = await axios.get(process.env.NEXT_PUBLIC_API_URL + '/projects');
            } else {
                response = await axios.get(process.env.NEXT_PUBLIC_API_URL + `/projects/type/${filter}`);
            }

            setProjects(response.data);
            setLoading(false);
        } catch (err) {
            setError("Không thể lọc dữ liệu. Vui lòng thử lại sau.");
            setLoading(false);
            console.error("Error filtering projects:", err);
        }
    };

    return (
        <main className="container mx-auto py-10 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-blue-900">Công Trình Đã Thi Công</h1>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                    Chúng tôi tự hào giới thiệu những công trình rèm cửa đã thi công thực tế.
                    Dưới đây là bộ sưu tập các dự án tiêu biểu mà chúng tôi đã hoàn thành,
                    giúp quý khách hàng có cái nhìn trực quan về chất lượng và phong cách làm việc của Curtain Shop.
                </p>
            </div>

            {/* Filter options */}
            <div className="mb-8 flex flex-wrap gap-2 justify-center">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-8 text-gray-600">
                            <p>Không có công trình nào thuộc danh mục này.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Installation process */}
            <section className="mb-12 bg-gray-50 p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-blue-800 text-center">Quy trình thi công lắp đặt rèm</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                        <h3 className="font-semibold mb-2">Khảo sát và tư vấn</h3>
                        <p className="text-gray-600 text-sm">Đội ngũ đến tận nơi đo đạc, tư vấn mẫu mã phù hợp.</p>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                        <h3 className="font-semibold mb-2">Báo giá & ký hợp đồng</h3>
                        <p className="text-gray-600 text-sm">Gửi báo giá chi tiết, ký hợp đồng nếu khách hàng đồng ý.</p>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                        <h3 className="font-semibold mb-2">Thi công lắp đặt</h3>
                        <p className="text-gray-600 text-sm">Lắp đặt rèm đúng kỹ thuật, vệ sinh sạch sẽ sau khi hoàn thành.</p>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">4</div>
                        <h3 className="font-semibold mb-2">Nghiệm thu & bàn giao</h3>
                        <p className="text-gray-600 text-sm">Khách hàng kiểm tra, nghiệm thu và được hướng dẫn sử dụng.</p>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm text-center">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">5</div>
                        <h3 className="font-semibold mb-2">Hỗ trợ sau lắp đặt</h3>
                        <p className="text-gray-600 text-sm">Bảo hành, hỗ trợ kỹ thuật tận tình.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-blue-800 text-center">Cảm nhận khách hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="italic text-gray-700 mb-4">"Rèm cửa được lắp rất nhanh, đẹp và đúng ý tôi. Đội ngũ thi công chuyên nghiệp, tư vấn tận tình. Tôi rất hài lòng!"</p>
                        <div className="font-semibold text-blue-700">- Chị Lan, Quận 7</div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="italic text-gray-700 mb-4">"Chất lượng rèm rất tốt, màu sắc đúng như mẫu. Đặc biệt ấn tượng với đội ngũ lắp đặt chuyên nghiệp và gọn gàng."</p>
                        <div className="font-semibold text-blue-700">- Anh Tuấn, Quận 2</div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="italic text-gray-700 mb-4">"Tôi đã tìm hiểu nhiều nơi và quyết định chọn Curtain Shop. Kết quả hoàn toàn xứng đáng, rèm đẹp và chất lượng vượt mong đợi."</p>
                        <div className="font-semibold text-blue-700">- Chị Hương, Quận 10</div>
                    </div>
                </div>
            </section>

            <div className="text-center bg-blue-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-800">Bạn muốn thi công rèm cho công trình của mình?</h3>
                <p className="text-gray-700 mb-5">Hãy liên hệ với chúng tôi để được tư vấn và báo giá miễn phí!</p>
                <Link href="/contact"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium">
                    Liên hệ ngay
                </Link>
            </div>
        </main>
    );
}
