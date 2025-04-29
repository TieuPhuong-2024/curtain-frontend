"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {deleteCategory, getCategories} from '@/lib/api';
import Image from "next/image";

export default function CategoryListPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        getCategories()
            .then((data) => setCategories(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleAdd = () => {
        router.push("/admin/categories/add");
    };

    const handleEdit = (id) => {
        router.push(`/admin/categories/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await deleteCategory(id);
            setCategories((prev) => prev.filter((cat) => cat._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{
            maxWidth: 700,
            margin: '32px auto',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px #eee',
            padding: 24
        }}>
            <h1 style={{fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#4f46e5', textAlign: 'center'}}>Quản lý
                danh mục sản phẩm</h1>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 20}}>
                <button
                    onClick={handleAdd}
                    style={{
                        background: '#4f46e5',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '8px 18px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 16
                    }}
                >+ Thêm danh mục
                </button>
            </div>
            {loading ? (
                <div style={{textAlign: 'center', padding: 32}}>
                    <div className="loader" style={{
                        margin: '0 auto 12px',
                        border: '4px solid #eee',
                        borderTop: '4px solid #4f46e5',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <div style={{color: '#666'}}>Đang tải dữ liệu...</div>
                    <style>{`@keyframes spin { 0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}</style>
                </div>
            ) : error ? (
                <div style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: 16,
                    borderRadius: 8,
                    textAlign: 'center',
                    fontWeight: 500
                }}>
                    {error}
                </div>
            ) : (
                <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 8, background: '#fafbff'}}>
                        <thead>
                        <tr style={{background: '#f1f5f9'}}>
                            <th style={{
                                padding: '10px 8px',
                                fontWeight: 700,
                                color: '#444',
                                fontSize: 15,
                                borderBottom: '2px solid #e5e7eb',
                                width: '60px'
                            }}>Ảnh
                            </th>
                            <th style={{
                                padding: '10px 8px',
                                fontWeight: 700,
                                color: '#444',
                                fontSize: 15,
                                borderBottom: '2px solid #e5e7eb',
                                textAlign: 'left'
                            }}>Tên danh mục
                            </th>
                            <th style={{
                                padding: '10px 8px',
                                fontWeight: 700,
                                color: '#444',
                                fontSize: 15,
                                borderBottom: '2px solid #e5e7eb'
                            }}>Hành động
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{textAlign: 'center', padding: 24, color: '#888'}}>Không có danh
                                    mục nào
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat._id || cat}
                                    style={{borderBottom: '1px solid #e5e7eb', transition: 'background .2s'}}>
                                    <td style={{padding: '10px 8px', fontSize: 15}}>
                                        <div style={{position: 'relative', width: '40px', height: '40px', margin: '0 auto'}}>
                                            <Image 
                                                src={cat.image || '/images/curtain-placeholder.jpg'}
                                                alt={cat.name}
                                                fill
                                                style={{objectFit: 'cover', borderRadius: '4px'}}
                                            />
                                        </div>
                                    </td>
                                    <td style={{padding: '10px 8px', fontSize: 15, textAlign: 'left'}}>{cat.name || cat}</td>
                                    <td style={{padding: '10px 8px'}}>
                                        <button
                                            onClick={() => handleEdit(cat._id || cat)}
                                            style={{
                                                background: '#fbbf24',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 6,
                                                padding: '6px 14px',
                                                fontWeight: 600,
                                                marginRight: 8,
                                                cursor: 'pointer'
                                            }}
                                        >Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat._id || cat)}
                                            style={{
                                                background: '#ef4444',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 6,
                                                padding: '6px 14px',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
