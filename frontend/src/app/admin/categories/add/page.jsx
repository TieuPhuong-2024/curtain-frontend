"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createCategory, uploadImage} from "@/lib/api";
import Image from "next/image";

export default function AddCategoryPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const router = useRouter();

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview the image
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
        
        setImageFile(file);
    };

    // Handle removing the image
    const handleRemoveImage = () => {
        setImage("");
        setImageFile(null);
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;
        
        try {
            setUploadingImage(true);
            const uploadedImage = await uploadImage(imageFile);
            setImage(uploadedImage.url);
            return uploadedImage.url;
        } catch (err) {
            setError("Không thể tải lên hình ảnh. " + err.message);
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            let imageUrl = image;
            
            // Upload image if there's a new file
            if (imageFile) {
                imageUrl = await handleImageUpload();
                if (!imageUrl) {
                    setLoading(false);
                    return;
                }
            }
            
            await createCategory({name, description, image: imageUrl});
            router.push("/admin/categories");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: 500,
            margin: '40px auto',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 8px #eee',
            padding: 32
        }}>
            <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 18, color: '#4f46e5', textAlign: 'center'}}>Thêm
                danh mục sản phẩm</h1>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: 22}}>
                    <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#444'}}>Tên danh
                        mục:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 16,
                            outline: 'none',
                            transition: 'border .2s',
                            background: '#fafbff'
                        }}
                        placeholder="Nhập tên danh mục"
                        autoFocus
                    />
                </div>
                
                <div style={{marginBottom: 22}}>
                    <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#444'}}>Mô tả:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 16,
                            outline: 'none',
                            transition: 'border .2s',
                            background: '#fafbff',
                            minHeight: '100px',
                            resize: 'vertical'
                        }}
                        placeholder="Nhập mô tả danh mục (không bắt buộc)"
                    />
                </div>
                
                <div style={{marginBottom: 22}}>
                    <label style={{display: 'block', marginBottom: 8, fontWeight: 600, color: '#444'}}>Hình ảnh đại diện:</label>
                    
                    <div 
                        style={{
                            border: '2px dashed #d1d5db',
                            borderRadius: 8,
                            padding: 20,
                            textAlign: 'center',
                            backgroundColor: '#f9fafb',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginBottom: 12,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onClick={(e) => {
                            if (e.target !== e.currentTarget && e.target.tagName !== 'DIV' && e.target.tagName !== 'SPAN') {
                                return;
                            }
                            document.getElementById('file-upload').click();
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <div style={{fontWeight: 500, color: '#374151'}}>
                                Click để chọn hình ảnh hoặc kéo thả vào đây
                            </div>
                            <div style={{fontSize: 14, color: '#6b7280'}}>
                                Hỗ trợ file: JPG, PNG, GIF
                            </div>
                        </div>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                opacity: 0,
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer',
                                zIndex: -1
                            }}
                        />
                    </div>
                    
                    {image && (
                        <div style={{marginTop: 12, position: 'relative', height: '200px', width: '100%'}}>
                            <Image 
                                src={image}
                                alt="Category preview"
                                fill
                                style={{objectFit: 'cover', borderRadius: '8px'}}
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    right: 10,
                                    background: 'rgba(220, 38, 38, 0.8)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: 30,
                                    height: 30,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 20,
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                                title="Xóa ảnh"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>
                
                {error && <div style={{
                    background: '#fee2e2',
                    color: '#b91c1c',
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    textAlign: 'center',
                    fontWeight: 500
                }}>{error}</div>}
                <div style={{display: 'flex', justifyContent: 'center', gap: 12}}>
                    <button
                        type="submit"
                        disabled={loading || uploadingImage}
                        style={{
                            background: '#4f46e5',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '10px 28px',
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: (loading || uploadingImage) ? 'not-allowed' : 'pointer',
                            opacity: (loading || uploadingImage) ? 0.7 : 1
                        }}
                    >{loading ? (
                        <span>
                          <span className="loader" style={{
                              marginRight: 8,
                              border: '3px solid #eee',
                              borderTop: '3px solid #4f46e5',
                              borderRadius: '50%',
                              width: 18,
                              height: 18,
                              display: 'inline-block',
                              verticalAlign: 'middle',
                              animation: 'spin 1s linear infinite'
                          }}></span>
                          Đang lưu...
                          <style>{`@keyframes spin { 0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);} }`}</style>
                        </span>
                    ) : "Lưu"}</button>
                    <button
                        type="button"
                        style={{
                            background: '#e5e7eb',
                            color: '#444',
                            border: 'none',
                            borderRadius: 6,
                            padding: '10px 24px',
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: 'pointer'
                        }}
                        onClick={() => router.push("/admin/categories")}
                    >Huỷ
                    </button>
                </div>
            </form>
        </div>
    );
}

