'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  addImageToCurtain,
  deleteImage,
  getCurtainById,
  getImagesByCurtainId,
  updateCurtain,
  uploadImage,
} from '@/lib/api';
import CurtainForm from '@/components/admin/CurtainForm';
import PageHeader from '@/components/admin/PageHeader';
import Panel from '@/components/admin/Panel';
import Button, { buttonClasses } from '@/components/admin/Button';
import { notify } from '@/components/admin/notify';

function toInputValue(value) {
  return value == null ? '' : String(value);
}

export default function EditCurtain() {
  const router = useRouter();
  const { id } = useParams();
  const [initial, setInitial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCurtain = async () => {
    if (!id) {
      setError('Không xác định được sản phẩm cần sửa.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await getCurtainById(id);

      let images = Array.isArray(data.images) ? data.images : [];
      if (images.length === 0) {
        try {
          const fetchedImages = await getImagesByCurtainId(id);
          images = Array.isArray(fetchedImages) ? fetchedImages : [];
        } catch (imagesError) {
          console.error('Error fetching images:', imagesError);
        }
      }

      const price = data.price;
      const legacyValue =
        typeof price === 'number' || typeof price === 'string' ? String(price) : '';
      const priceObject = price && typeof price === 'object' ? price : {};

      setInitial({
        form: {
          name: data.name || '',
          description: data.description || '',
          category: data.category?._id || data.category || '',
          material: data.material || '',
          color: data.color?._id || data.color || '',
          mainImage: data.mainImage || data.image || '',
          inStock: data.inStock !== undefined ? data.inStock : true,
        },
        priceType: priceObject.type || 'fixed',
        priceData: {
          value: legacyValue || toInputValue(priceObject.value),
          min: toInputValue(priceObject.min),
          max: toInputValue(priceObject.max),
          old: toInputValue(priceObject.old),
          new: toInputValue(priceObject.new),
        },
        images,
      });
    } catch (fetchError) {
      console.error('Error fetching curtain:', fetchError);
      setError('Không tải được thông tin sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurtain();
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateCurtain(id, payload);
    notify.success('Đã cập nhật sản phẩm.');
    router.push('/admin/curtains');
  };

  const handleAddImage = async (file) => {
    const uploadResult = await uploadImage(file);
    const savedImage = await addImageToCurtain(id, {
      url: uploadResult.url,
      isMain: false,
    });
    return { ...savedImage, preview: URL.createObjectURL(file) };
  };

  const handleRemoveImage = async (image) => {
    await deleteImage(image._id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <PageHeader
          title="Sửa sản phẩm"
          description="Đang mở hồ sơ sản phẩm…"
          actions={
            <Link href="/admin/curtains" className={buttonClasses('secondary', 'md')}>
              Quay lại sản phẩm
            </Link>
          }
        />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-6">
            <Panel>
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {[0, 1, 2, 3].map((item) => (
                  <div key={item} className={item < 2 ? 'sm:col-span-2' : ''}>
                    <div className="h-3 w-24 animate-pulse rounded bg-[var(--a-line)]" />
                    <div className="mt-2 h-9 animate-pulse rounded-[var(--a-radius-sm)] bg-[var(--a-line)]" />
                  </div>
                ))}
              </div>
            </Panel>
            <Panel>
              <div className="p-5 sm:p-6">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--a-line)]" />
                <div className="mt-3 h-9 w-2/3 animate-pulse rounded-[var(--a-radius-sm)] bg-[var(--a-line)]" />
              </div>
            </Panel>
          </div>
          <div className="space-y-6">
            <Panel>
              <div className="aspect-[4/3] animate-pulse bg-[var(--a-line)]" />
            </Panel>
            <Panel>
              <div className="h-24 animate-pulse bg-[var(--a-line)]" />
            </Panel>
          </div>
        </div>
        <span role="status" className="sr-only">
          Đang tải dữ liệu sản phẩm…
        </span>
      </div>
    );
  }

  if (!initial) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Sửa sản phẩm"
          description="Không mở được hồ sơ sản phẩm."
          actions={
            <Link href="/admin/curtains" className={buttonClasses('secondary', 'md')}>
              Quay lại sản phẩm
            </Link>
          }
        />
        <Panel className="border-[rgba(156,59,54,0.25)]">
          <div className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--a-danger)]">
              {error || 'Không tìm thấy sản phẩm này.'}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={loadCurtain}>
                Thử lại
              </Button>
              <Link href="/admin/curtains" className={buttonClasses('secondary', 'sm')}>
                Quay lại
              </Link>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <CurtainForm
      mode="edit"
      heading="Sửa sản phẩm"
      description="Cập nhật giá, màu, ảnh và tình trạng hàng của mẫu rèm này."
      submitLabel="Lưu thay đổi"
      initialForm={initial.form}
      initialPriceType={initial.priceType}
      initialPriceData={initial.priceData}
      initialImages={initial.images}
      onSubmit={handleSubmit}
      onAddImage={handleAddImage}
      onRemoveImage={handleRemoveImage}
    />
  );
}
