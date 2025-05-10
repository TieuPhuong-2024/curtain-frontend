'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProjectById } from '../../../lib/api';
import Link from 'next/link';
import { FaMapMarkerAlt, FaArrowLeft, FaImages } from 'react-icons/fa';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { renderCKEditorContent } from '@/utils/ckeditorConverter';
import '@/app/styles/content-styles.css';

export default function ProjectDetailPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.id;

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        if (projectId) {
            const fetchProjectDetails = async () => {
                try {
                    setLoading(true);
                    const projectData = await getProjectById(projectId);
                    setProject(projectData);
                    setLoading(false);
                } catch (err) {
                    console.error("Error fetching project details:", err);
                    setError("Không thể tải dữ liệu công trình. Công trình có thể không tồn tại hoặc đã có lỗi xảy ra.");
                    setLoading(false);
                }
            };
            fetchProjectDetails();
        }
    }, [projectId]);

    if (loading) {
        return (
            <div className="container mx-auto py-20 px-4 text-center min-h-screen">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-4 text-xl text-gray-700">Đang tải chi tiết công trình...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-20 px-4 text-center min-h-screen">
                <p className="text-2xl text-red-600 mb-6">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium flex items-center mx-auto"
                >
                    <FaArrowLeft className="mr-2" /> Quay lại
                </button>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto py-20 px-4 text-center min-h-screen">
                <p className="text-2xl text-gray-700 mb-6">Không tìm thấy công trình.</p>
                <Link href="/cong-trinh"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium flex items-center mx-auto"
                >
                    <FaArrowLeft className="mr-2" /> Xem tất cả công trình
                </Link>
            </div>
        );
    }

    const slides = [];
    if (project.thumbnail) {
        slides.push({ type: 'image', src: project.thumbnail });
    }

    const handleOpenLightbox = (type, idx) => {
        if (project.thumbnail) {
            setLightboxIndex(0);
            setLightboxOpen(true);
            document.body.style.overflow = 'hidden';
        }
    };

    const handleCloseLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => router.push('/cong-trinh')}
                    className="cursor-pointer mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                    <FaArrowLeft className="mr-2" /> Quay lại danh sách công trình
                </button>

                <article className="bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Image Gallery Section */}
                    {project.thumbnail && (
                        <div className="relative h-80 md:h-96 lg:h-[500px] w-full cursor-pointer group"
                            onClick={() => handleOpenLightbox('image', 0)} >
                            <Image
                                src={project.thumbnail}
                                alt={`${project.title} - Ảnh thumbnail`}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="group-hover:opacity-90 transition-opacity duration-300"
                                priority
                                sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <FaImages className="text-white text-4xl" />
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{project.title}</h1>

                        <div className="flex flex-wrap items-center text-gray-600 mb-6 space-x-4 text-sm">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{project.type}</span>
                            {project.location && (
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="mr-1 text-gray-500" /> {project.location}
                                </div>
                            )}
                        </div>

                        {project.shortDescription && (
                            <p className="text-gray-600 text-md italic leading-relaxed mb-6">
                                {project.shortDescription}
                            </p>
                        )}

                        {/* Cong trinh content */}
                        <div className="prose prose-lg max-w-none mb-12 post-content">
                            <div
                                className="ck-content"
                                dangerouslySetInnerHTML={{ __html: renderCKEditorContent(project.detailedContent) }}
                            />
                        </div>

                        <div className="pt-8 border-t border-gray-200 text-center">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">Bạn có dự án tương tự?</h3>
                            <p className="text-gray-700 mb-6 max-w-xl mx-auto">Chúng tôi sẵn sàng tư vấn và thi công rèm cửa cho công trình của bạn với chất lượng tốt nhất.</p>
                            <Link href="/contact"
                                className="inline-block bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition font-medium text-lg"
                            >
                                Liên hệ tư vấn ngay
                            </Link>
                        </div>
                    </div>
                </article>
            </div>

            <Lightbox
                open={lightboxOpen}
                close={handleCloseLightbox}
                slides={slides}
                index={lightboxIndex}
                render={{
                    slide: ({ slide }) => {
                        if (slide.type === 'image') {
                            return (
                                <img
                                    src={slide.src}
                                    alt="Chi tiết công trình"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                        margin: 'auto'
                                    }}
                                />
                            );
                        }
                        return null;
                    }
                }}
            />
        </main>
    );
} 