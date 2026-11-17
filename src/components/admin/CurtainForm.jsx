'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  FaCheck,
  FaImage,
  FaPen,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrashAlt,
  FaUpload,
} from 'react-icons/fa';

import { createCategory, getCategories } from '@/lib/categoryApi';
import { createColor, getColorById, getColors, updateColor } from '@/lib/colorApi';
import { uploadImage } from '@/lib/uploadApi';
import PageHeader from './PageHeader';
import Panel, { PanelHeader } from './Panel';
import Button, { buttonClasses } from './Button';
import Badge from './Badge';
import Field, { controlClass, selectClass } from './Field';
import ConfirmDialog from './ConfirmDialog';
import { formatPrice } from './format';
import { notify } from './notify';

const emptyForm = {
  name: '',
  description: '',
  category: '',
  material: '',
  color: '',
  mainImage: '',
  inStock: true,
};

const emptyPriceData = { value: '', min: '', max: '', old: '', new: '' };

const priceTypes = [
  { value: 'fixed', label: 'Giá cố định' },
  { value: 'range', label: 'Khoảng giá' },
  { value: 'discount', label: 'Giá giảm' },
  { value: 'contact', label: 'Liên hệ' },
];

function toInputValue(value) {
  return value == null ? '' : String(value);
}

function buildPricePayload(type, data) {
  if (type === 'range') {
    return { type, min: Number(data.min), max: Number(data.max) };
  }
  if (type === 'discount') {
    return { type, old: Number(data.old), new: Number(data.new) };
  }
  if (type === 'contact') {
    return { type };
  }
  return { type: 'fixed', value: Number(data.value) };
}

function buildPricePreview(type, data) {
  if (type === 'contact') return 'Liên hệ';
  if (type === 'fixed') {
    return data.value === '' ? null : formatPrice({ type, value: Number(data.value) });
  }
  if (type === 'range') {
    if (data.min === '' && data.max === '') return null;
    return formatPrice({
      type,
      min: data.min === '' ? null : Number(data.min),
      max: data.max === '' ? null : Number(data.max),
    });
  }
  if (type === 'discount') {
    if (data.old === '' || data.new === '') return null;
    return formatPrice({ type, old: Number(data.old), new: Number(data.new) });
  }
  return null;
}

export default function CurtainForm({
  mode = 'add',
  heading,
  description,
  submitLabel,
  initialForm = null,
  initialPriceType = 'fixed',
  initialPriceData = null,
  initialImages = [],
  onSubmit,
  onAddImage,
  onRemoveImage,
  backHref = '/admin/curtains',
}) {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState(() => ({ ...emptyForm, ...(initialForm || {}) }));
  const [priceType, setPriceType] = useState(initialPriceType);
  const [priceData, setPriceData] = useState(() => ({
    value: toInputValue(initialPriceData?.value),
    min: toInputValue(initialPriceData?.min),
    max: toInputValue(initialPriceData?.max),
    old: toInputValue(initialPriceData?.old),
    new: toInputValue(initialPriceData?.new),
  }));

  const [images, setImages] = useState(initialImages);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState({ categories: false, colors: false });
  const [selectedColor, setSelectedColor] = useState(null);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [addCategoryError, setAddCategoryError] = useState('');
  const categoryFileInputRef = useRef(null);

  const [showColorModal, setShowColorModal] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHexCode, setNewColorHexCode] = useState('');
  const [addColorError, setAddColorError] = useState('');
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [currentColorId, setCurrentColorId] = useState(null);

  const [pendingRemove, setPendingRemove] = useState(null);
  const [removingImage, setRemovingImage] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.allSettled([getCategories(), getColors()]).then(([categoryResult, colorResult]) => {
      if (!active) return;

      if (categoryResult.status === 'fulfilled') {
        setCategories(Array.isArray(categoryResult.value) ? categoryResult.value : []);
      } else {
        console.error('Error fetching categories:', categoryResult.reason);
        setOptionsError((prev) => ({ ...prev, categories: true }));
      }

      if (colorResult.status === 'fulfilled') {
        setColors(Array.isArray(colorResult.value) ? colorResult.value : []);
      } else {
        console.error('Error fetching colors:', colorResult.reason);
        setOptionsError((prev) => ({ ...prev, colors: true }));
      }

      setOptionsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!formData.color) {
      setSelectedColor(null);
      return undefined;
    }

    const known = colors.find((color) => color._id === formData.color);
    if (known) setSelectedColor(known);

    let active = true;
    getColorById(formData.color)
      .then((data) => {
        if (active) setSelectedColor(data);
      })
      .catch((colorError) => {
        console.error('Error fetching color details:', colorError);
      });

    return () => {
      active = false;
    };
  }, [formData.color, colors]);

  useEffect(() => {
    if (!showColorModal) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape' && !isAddingColor) {
        setShowColorModal(false);
        setAddColorError('');
        setIsEditingColor(false);
        setCurrentColorId(null);
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showColorModal, isAddingColor]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, color: value }));
  };

  const handlePriceChange = (field, value) => {
    setPriceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMainUrlChange = (event) => {
    const { value } = event.target;
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData((prev) => ({ ...prev, mainImage: value }));
  };

  const handleMainFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFormData((prev) => ({ ...prev, mainImage: '' }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveMainImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, mainImage: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const refreshColors = async () => {
    const data = await getColors();
    setColors(Array.isArray(data) ? data : []);
  };

  const handleCategoryImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCategoryImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setCategoryImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || isAddingCategory) return;

    setIsAddingCategory(true);
    setAddCategoryError('');

    try {
      let imageUrl = '';
      if (categoryImage) {
        const uploadResult = await uploadImage(categoryImage);
        imageUrl = uploadResult.url;
      }

      const created = await createCategory({
        name: newCategoryName.trim(),
        image: imageUrl,
      });

      setCategories((prev) => [...prev, created]);
      setFormData((prev) => ({ ...prev, category: created._id }));
      setNewCategoryName('');
      setCategoryImage(null);
      setCategoryImagePreview('');
      setShowAddCategory(false);
      if (categoryFileInputRef.current) categoryFileInputRef.current.value = '';
      notify.success('Đã thêm danh mục mới.');
    } catch (categoryError) {
      console.error('Error adding category:', categoryError);
      setAddCategoryError('Không thêm được danh mục. Vui lòng thử lại.');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleOpenAddColorModal = () => {
    setNewColorName('');
    setNewColorHexCode('');
    setAddColorError('');
    setIsEditingColor(false);
    setCurrentColorId(null);
    setShowColorModal(true);
  };

  const handleOpenEditColorModal = async (colorId) => {
    setAddColorError('');
    setIsEditingColor(true);
    setCurrentColorId(colorId);

    try {
      const colorData = await getColorById(colorId);
      setNewColorName(colorData.name || '');
      setNewColorHexCode(colorData.hexCode || '');
      setShowColorModal(true);
    } catch (colorError) {
      console.error('Error fetching color for edit:', colorError);
      setIsEditingColor(false);
      setCurrentColorId(null);
      notify.error('Không tải được thông tin màu sắc.');
    }
  };

  const handleCloseColorModal = () => {
    if (isAddingColor) return;
    setShowColorModal(false);
    setAddColorError('');
    setIsEditingColor(false);
    setCurrentColorId(null);
  };

  const handleSaveColor = async () => {
    if (!newColorName.trim()) {
      setAddColorError('Tên màu sắc không được để trống.');
      return;
    }

    setIsAddingColor(true);
    setAddColorError('');

    try {
      const colorData = { name: newColorName.trim(), hexCode: newColorHexCode || '#808080' };

      if (isEditingColor && currentColorId) {
        await updateColor(currentColorId, colorData);
      } else {
        const savedColor = await createColor(colorData);
        setFormData((prev) => ({ ...prev, color: savedColor._id }));
      }

      await refreshColors();
      setShowColorModal(false);
      setAddColorError('');
      setIsEditingColor(false);
      setCurrentColorId(null);
      notify.success(isEditingColor ? 'Đã cập nhật màu sắc.' : 'Đã thêm màu sắc mới.');
    } catch (colorError) {
      console.error('Error saving color:', colorError);
      setAddColorError(colorError.response?.data?.message || 'Không lưu được màu sắc.');
    } finally {
      setIsAddingColor(false);
    }
  };

  const uploadAdditionalImage = async (file) => {
    if (onAddImage) return onAddImage(file);
    const result = await uploadImage(file);
    return { url: result.url, preview: URL.createObjectURL(file) };
  };

  const handleAdditionalFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    setUploadingImages(true);
    setError('');

    for (const file of files) {
      try {
        const image = await uploadAdditionalImage(file);
        setImages((prev) => [...prev, image]);
      } catch (uploadError) {
        console.error('Error adding additional image:', uploadError);
        setError('Không thêm được ảnh phụ. Vui lòng thử lại.');
        break;
      }
    }

    setUploadingImages(false);
  };

  const removeImageFromState = (image) => {
    setImages((prev) => prev.filter((item) => item !== image));
    if (image?.url && image.url === formData.mainImage) {
      setFormData((prev) => ({ ...prev, mainImage: '' }));
    }
  };

  const requestRemoveImage = (image) => {
    if (image._id && onRemoveImage) {
      setPendingRemove(image);
      return;
    }
    removeImageFromState(image);
  };

  const confirmRemoveImage = async () => {
    if (!pendingRemove) return;

    setRemovingImage(true);
    setError('');

    try {
      await onRemoveImage(pendingRemove);
      removeImageFromState(pendingRemove);
      notify.success('Đã xóa ảnh.');
    } catch (removeError) {
      console.error('Error deleting image:', removeError);
      setError('Không xóa được ảnh. Vui lòng thử lại.');
    } finally {
      setRemovingImage(false);
      setPendingRemove(null);
    }
  };

  const handleSetMainImage = (image) => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFormData((prev) => ({ ...prev, mainImage: image.url }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setAddColorError('');

    const missingRequired =
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !formData.material.trim() ||
      !formData.color ||
      (priceType === 'fixed' && priceData.value === '') ||
      (priceType === 'range' && (priceData.min === '' || priceData.max === '')) ||
      (priceType === 'discount' && (priceData.old === '' || priceData.new === ''));

    if (missingRequired) {
      setError('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return;
    }

    if (!selectedFile && !formData.mainImage) {
      setError('Vui lòng chọn hình ảnh chính cho sản phẩm.');
      return;
    }

    setIsSubmitting(true);

    let mainImageUrl = formData.mainImage;
    if (selectedFile) {
      try {
        const uploadResult = await uploadImage(selectedFile);
        mainImageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('Error uploading main image:', uploadError);
        setError('Có lỗi xảy ra khi tải lên hình ảnh chính. Vui lòng thử lại sau.');
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      material: formData.material.trim(),
      color: formData.color,
      inStock: formData.inStock,
      mainImage: mainImageUrl,
      price: buildPricePayload(priceType, priceData),
    };

    if (!isEdit) {
      payload.additionalImages = images.map((image) => image.url).filter(Boolean);
    }

    try {
      await onSubmit(payload);
    } catch (submitError) {
      console.error('Error submitting curtain:', submitError);
      setError(
        isEdit
          ? 'Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại sau.'
          : 'Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại sau.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayImage = imagePreview || formData.mainImage;
  const previewPrice = buildPricePreview(priceType, priceData);
  const selectedHex = selectedColor?.hexCode || '#808080';
  const pickerValue = /^#[0-9a-fA-F]{6}$/.test(newColorHexCode) ? newColorHexCode : '#808080';

  return (
    <div className="space-y-6">
      <PageHeader
        title={heading}
        description={description}
        actions={
          <>
            <Link href={backHref} className={buttonClasses('secondary', 'md')}>
              Quay lại sản phẩm
            </Link>
            <Button
              type="submit"
              form="curtain-form"
              variant="primary"
              size="md"
              icon={FaSave}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu…' : submitLabel}
            </Button>
          </>
        }
      />

      <form
        id="curtain-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_350px] xl:items-start"
      >
        {error && (
          <div
            role="alert"
            className="rounded-[var(--a-radius)] border border-[rgba(156,59,54,0.25)] bg-[var(--a-danger-soft)] px-4 py-3 text-[13px] text-[var(--a-danger)] xl:col-span-2"
          >
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Panel>
            <PanelHeader
              title="Thông tin mẫu rèm"
              description="Tên, nhóm và chất liệu giúp khách nhận ra mẫu này."
            />
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-6">
              <Field
                label="Tên sản phẩm"
                htmlFor="curtain-name"
                required
                className="sm:col-span-2"
              >
                <input
                  id="curtain-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Rèm lanh trơn phòng khách"
                  className={controlClass}
                  autoFocus
                  required
                />
              </Field>

              <Field
                label="Danh mục"
                htmlFor="curtain-category"
                required
                error={optionsError.categories ? 'Không tải được danh mục.' : undefined}
                hint="Phân nhóm để khách dễ tìm trong danh sách."
              >
                <div className="flex gap-2">
                  <select
                    id="curtain-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`${selectClass} min-w-0 flex-1`}
                    required
                  >
                    <option value="">
                      {optionsLoading ? 'Đang tải danh mục…' : 'Chọn danh mục'}
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="md"
                    variant="secondary"
                    icon={showAddCategory ? FaTimes : FaPlus}
                    onClick={() => setShowAddCategory((prev) => !prev)}
                    aria-expanded={showAddCategory}
                    aria-controls="curtain-new-category"
                  >
                    {showAddCategory ? 'Đóng' : 'Thêm'}
                  </Button>
                </div>

                {showAddCategory && (
                  <div
                    id="curtain-new-category"
                    className="mt-2 space-y-2 rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-raised)] p-3"
                  >
                    <p className="text-[12px] font-medium text-[var(--a-muted)]">Danh mục mới</p>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(event) => setNewCategoryName(event.target.value)}
                      placeholder="Tên danh mục"
                      className={controlClass}
                      aria-label="Tên danh mục mới"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={categoryFileInputRef}
                        onChange={handleCategoryImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={FaUpload}
                        onClick={() => categoryFileInputRef.current?.click()}
                      >
                        Ảnh danh mục
                      </Button>
                      {categoryImagePreview && (
                        <span className="relative inline-flex h-8 w-8 overflow-hidden rounded-[5px] border border-[var(--a-line)]">
                          <img
                            src={categoryImagePreview}
                            alt="Ảnh danh mục mới"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryImage(null);
                              setCategoryImagePreview('');
                              if (categoryFileInputRef.current) categoryFileInputRef.current.value = '';
                            }}
                            aria-label="Bỏ ảnh danh mục"
                            className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center bg-[#1b2f3b]/75 text-white"
                          >
                            <FaTimes className="h-2 w-2" />
                          </button>
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleAddCategory}
                        loading={isAddingCategory}
                        disabled={!newCategoryName.trim()}
                        className="ml-auto"
                      >
                        {isAddingCategory ? 'Đang thêm…' : 'Thêm'}
                      </Button>
                    </div>
                    {addCategoryError && (
                      <p className="text-[12px] text-[var(--a-danger)]">{addCategoryError}</p>
                    )}
                  </div>
                )}
              </Field>

              <Field
                label="Chất liệu"
                htmlFor="curtain-material"
                required
                hint="Ví dụ: vải lanh, voan, nhung."
              >
                <input
                  id="curtain-material"
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Vải lanh"
                  className={controlClass}
                  required
                />
              </Field>

              <Field
                label="Màu sắc"
                htmlFor="curtain-color"
                required
                error={optionsError.colors ? 'Không tải được danh sách màu.' : undefined}
                className="sm:col-span-2"
              >
                <div className="flex gap-2">
                  <select
                    id="curtain-color"
                    name="color"
                    value={formData.color}
                    onChange={handleColorChange}
                    className={`${selectClass} min-w-0 flex-1`}
                    required
                  >
                    <option value="">
                      {optionsLoading ? 'Đang tải màu…' : 'Chọn màu sắc'}
                    </option>
                    {colors.map((color) => (
                      <option key={color._id} value={color._id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="md"
                    variant="secondary"
                    icon={FaPlus}
                    onClick={handleOpenAddColorModal}
                  >
                    Màu mới
                  </Button>
                </div>

                {selectedColor && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-raised)] px-2.5 py-2">
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-[var(--a-line-strong)]"
                      style={{ backgroundColor: selectedHex }}
                      aria-hidden="true"
                    />
                    <span className="text-[12.5px] text-[var(--a-muted)]">
                      {selectedColor.name}
                    </span>
                    <span className="text-[12px] tabular-nums text-[var(--a-faint)]">
                      {selectedColor.hexCode || 'Chưa có mã màu'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenEditColorModal(selectedColor._id)}
                      aria-label="Sửa màu đang chọn"
                      title="Sửa màu"
                      className="ml-auto flex h-6 w-6 items-center justify-center rounded-[4px] text-[var(--a-faint)] transition hover:bg-[var(--a-surface)] hover:text-[var(--a-cham)]"
                    >
                      <FaPen className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
              </Field>

              <Field
                label="Mô tả"
                htmlFor="curtain-description"
                required
                hint="Chất liệu, độ cản sáng, cách treo và bối cảnh sử dụng."
                className="sm:col-span-2"
              >
                <textarea
                  id="curtain-description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ví dụ: rèm vải lanh dày, cản sáng vừa, phù hợp phòng khách và phòng ngủ."
                  className={`${controlClass} min-h-[120px] resize-y`}
                  required
                />
              </Field>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Giá bán"
              description="Chọn cách mẫu rèm này hiển thị giá với khách."
            />
            <div className="space-y-4 p-5 sm:p-6">
              <div
                role="group"
                aria-label="Loại giá"
                className="grid grid-cols-2 gap-1 rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-raised)] p-1 sm:grid-cols-4"
              >
                {priceTypes.map((type) => {
                  const active = priceType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setPriceType(type.value)}
                      className={`h-8 rounded-[5px] text-[12.5px] font-medium transition-colors ${
                        active
                          ? 'border border-[var(--a-line-strong)] bg-[var(--a-surface)] text-[var(--a-ink)] shadow-[0_1px_2px_rgba(34,31,27,0.06)]'
                          : 'border border-transparent text-[var(--a-muted)] hover:text-[var(--a-ink)]'
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>

              {priceType === 'fixed' && (
                <Field label="Giá bán" required hint="Đơn vị đồng. Ví dụ: 1250000.">
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={priceData.value}
                      onChange={(event) => handlePriceChange('value', event.target.value)}
                      placeholder="1250000"
                      className={`${controlClass} pr-10 tabular-nums`}
                      required
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--a-faint)]">
                      đ
                    </span>
                  </div>
                </Field>
              )}

              {priceType === 'range' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Giá thấp nhất" required>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={priceData.min}
                        onChange={(event) => handlePriceChange('min', event.target.value)}
                        placeholder="800000"
                        className={`${controlClass} pr-10 tabular-nums`}
                        required
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--a-faint)]">
                        đ
                      </span>
                    </div>
                  </Field>
                  <Field label="Giá cao nhất" required>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={priceData.max}
                        onChange={(event) => handlePriceChange('max', event.target.value)}
                        placeholder="2400000"
                        className={`${controlClass} pr-10 tabular-nums`}
                        required
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--a-faint)]">
                        đ
                      </span>
                    </div>
                  </Field>
                </div>
              )}

              {priceType === 'discount' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Giá cũ" required>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={priceData.old}
                        onChange={(event) => handlePriceChange('old', event.target.value)}
                        placeholder="2000000"
                        className={`${controlClass} pr-10 tabular-nums`}
                        required
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--a-faint)]">
                        đ
                      </span>
                    </div>
                  </Field>
                  <Field label="Giá mới" required>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        value={priceData.new}
                        onChange={(event) => handlePriceChange('new', event.target.value)}
                        placeholder="1600000"
                        className={`${controlClass} pr-10 tabular-nums`}
                        required
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--a-faint)]">
                        đ
                      </span>
                    </div>
                  </Field>
                </div>
              )}

              {priceType === 'contact' && (
                <div className="rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-raised)] px-3 py-2.5 text-[12.5px] leading-relaxed text-[var(--a-muted)]">
                  Sản phẩm sẽ hiển thị “Liên hệ” thay vì giá. Khách để lại số điện thoại để
                  xưởng tư vấn.
                </div>
              )}

              <div className="flex items-baseline justify-between gap-4 border-t border-dashed border-[var(--a-line)] pt-3">
                <span className="text-[12.5px] text-[var(--a-muted)]">Khách sẽ thấy</span>
                <span
                  className={`text-[15px] font-semibold tabular-nums ${
                    previewPrice ? 'text-[var(--a-ink)]' : 'text-[var(--a-faint)]'
                  }`}
                >
                  {previewPrice || 'Chưa nhập giá'}
                </span>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Ảnh chính" description="Ảnh đại diện trong danh sách sản phẩm.">
              <Badge tone="warning">Bắt buộc</Badge>
            </PanelHeader>
            <div className="p-5">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMainFileChange}
                accept="image/*"
                className="hidden"
              />

              {displayImage ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-raised)]">
                  <img
                    src={displayImage}
                    alt="Ảnh chính sản phẩm"
                    className="h-full w-full object-cover"
                  />
                  {imagePreview && (
                    <span className="absolute left-2 top-2">
                      <Badge tone="cham">Chưa lưu</Badge>
                    </span>
                  )}
                  <div className="absolute right-2 top-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Đổi ảnh chính"
                      title="Đổi ảnh"
                      className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-[var(--a-line)] bg-[var(--a-surface)] text-[var(--a-muted)] shadow-sm transition hover:text-[var(--a-cham)]"
                    >
                      <FaPen className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveMainImage}
                      aria-label="Bỏ ảnh chính"
                      title="Bỏ ảnh"
                      className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-[var(--a-line)] bg-[var(--a-surface)] text-[var(--a-muted)] shadow-sm transition hover:bg-[var(--a-danger-soft)] hover:text-[var(--a-danger)]"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-[var(--a-radius-sm)] border border-dashed border-[var(--a-line-strong)] bg-[var(--a-raised)] text-[var(--a-muted)] transition-colors hover:border-[var(--a-cham)] hover:text-[var(--a-cham)]"
                >
                  <FaImage className="h-6 w-6" aria-hidden="true" />
                  <span className="text-[13px] font-medium">Chọn ảnh từ máy</span>
                  <span className="text-[11.5px] text-[var(--a-faint)]">JPG, PNG hoặc WEBP</span>
                </button>
              )}

              <div className="mt-3">
                <label
                  htmlFor="curtain-main-url"
                  className="text-[12px] text-[var(--a-faint)]"
                >
                  Hoặc dán URL ảnh
                </label>
                <input
                  id="curtain-main-url"
                  type="url"
                  name="mainImage"
                  value={formData.mainImage}
                  onChange={handleMainUrlChange}
                  placeholder="https://…"
                  className={`${controlClass} mt-1`}
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Tình trạng">
              <Badge tone={formData.inStock ? 'success' : 'danger'} dot>
                {formData.inStock ? 'Còn hàng' : 'Hết hàng'}
              </Badge>
            </PanelHeader>
            <div className="p-5">
              <label
                htmlFor="curtain-stock"
                className="flex cursor-pointer items-center justify-between gap-4"
              >
                <span>
                  <span className="block text-[13px] font-medium text-[var(--a-ink)]">
                    Còn hàng
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-[var(--a-faint)]">
                    Tắt khi mẫu đang hết hàng để khách biết.
                  </span>
                </span>
                <span className="relative inline-block h-6 w-11 shrink-0">
                  <input
                    id="curtain-stock"
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <span className="absolute inset-0 rounded-full bg-[var(--a-line-strong)] transition-colors peer-checked:bg-[var(--a-cham)] peer-focus-visible:ring-[3px] peer-focus-visible:ring-[rgba(44,70,87,0.2)]" />
                  <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                </span>
              </label>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title={isEdit ? 'Tất cả ảnh' : 'Ảnh phụ'}
              description={
                isEdit
                  ? 'Ảnh thêm vào được lưu ngay vào sản phẩm.'
                  : 'Ảnh phụ giúp khách xem kỹ chất liệu.'
              }
            >
              <Button
                size="sm"
                variant="secondary"
                icon={FaPlus}
                onClick={() => additionalFileInputRef.current?.click()}
                loading={uploadingImages}
              >
                Thêm ảnh
              </Button>
            </PanelHeader>
            <div className="p-5">
              <input
                type="file"
                multiple
                ref={additionalFileInputRef}
                onChange={handleAdditionalFiles}
                accept="image/*"
                className="hidden"
              />

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {images.map((image) => {
                    const isMain = Boolean(image.url) && image.url === formData.mainImage;
                    return (
                      <figure
                        key={image._id || image.url}
                        className="overflow-hidden rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-surface)]"
                      >
                        <div className="relative aspect-square bg-[var(--a-raised)]">
                          <img
                            src={image.preview || image.url}
                            alt={isMain ? 'Ảnh chính' : 'Ảnh phụ'}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <figcaption className="flex items-center justify-between gap-1 border-t border-[var(--a-line)] px-1.5 py-1.5">
                          {isMain ? (
                            <span className="flex items-center gap-1 px-1.5 py-1 text-[11.5px] font-medium text-[var(--a-brass)]">
                              <FaCheck className="h-2.5 w-2.5" aria-hidden="true" />
                              Ảnh chính
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(image)}
                              className="flex items-center gap-1 rounded px-1.5 py-1 text-[11.5px] text-[var(--a-muted)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-cham)]"
                            >
                              <FaCheck className="h-2.5 w-2.5" aria-hidden="true" />
                              Đặt chính
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => requestRemoveImage(image)}
                            aria-label="Xóa ảnh"
                            title="Xóa ảnh"
                            className="flex h-6 w-6 items-center justify-center rounded text-[var(--a-faint)] transition hover:bg-[var(--a-danger-soft)] hover:text-[var(--a-danger)]"
                          >
                            <FaTrashAlt className="h-3 w-3" />
                          </button>
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[var(--a-radius-sm)] border border-dashed border-[var(--a-line-strong)] px-3 py-6 text-center text-[12px] leading-relaxed text-[var(--a-faint)]">
                  Chưa có ảnh phụ. Thêm ảnh để khách xem nhiều góc hơn.
                </div>
              )}
            </div>
          </Panel>
        </div>

        <Panel className="xl:col-span-2">
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-[var(--a-faint)]">
              Trường có dấu * là bắt buộc.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Link href={backHref} className={buttonClasses('secondary', 'md')}>
                Hủy
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={FaSave}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Đang lưu…' : submitLabel}
              </Button>
            </div>
          </div>
        </Panel>
      </form>

      {showColorModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#1b2f3b]/40 backdrop-blur-[2px]"
            onClick={handleCloseColorModal}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="curtain-color-title"
            className="relative w-full max-w-sm rounded-[12px] border border-[var(--a-line)] bg-[var(--a-surface)] p-5 shadow-[0_24px_60px_rgba(27,47,59,0.22)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2
                  id="curtain-color-title"
                  className="text-[15px] font-semibold text-[var(--a-ink)]"
                >
                  {isEditingColor ? 'Sửa màu sắc' : 'Thêm màu sắc'}
                </h2>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--a-muted)]">
                  Màu dùng để phân loại và hiển thị cạnh sản phẩm.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseColorModal}
                disabled={isAddingColor}
                aria-label="Đóng"
                className="flex h-7 w-7 items-center justify-center rounded-[5px] text-[var(--a-faint)] transition hover:bg-[var(--a-raised)] hover:text-[var(--a-ink)] disabled:opacity-50"
              >
                <FaTimes className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <Field label="Tên màu" htmlFor="curtain-color-name" required>
                <input
                  id="curtain-color-name"
                  type="text"
                  value={newColorName}
                  onChange={(event) => setNewColorName(event.target.value)}
                  placeholder="Ví dụ: Xanh chàm"
                  className={controlClass}
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSaveColor();
                    }
                  }}
                />
              </Field>

              <Field label="Mã màu" htmlFor="curtain-color-hex" hint="Dùng mã hex, ví dụ #2C4657.">
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={pickerValue}
                    onChange={(event) => setNewColorHexCode(event.target.value)}
                    aria-label="Chọn màu"
                    className="h-9 w-11 shrink-0 cursor-pointer rounded-[var(--a-radius-sm)] border border-[var(--a-line-strong)] bg-[var(--a-surface)] p-0.5"
                  />
                  <input
                    id="curtain-color-hex"
                    type="text"
                    value={newColorHexCode}
                    onChange={(event) => setNewColorHexCode(event.target.value)}
                    placeholder="#808080"
                    className={`${controlClass} flex-1 tabular-nums`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSaveColor();
                      }
                    }}
                  />
                </div>
              </Field>

              <div className="flex items-center gap-2.5 rounded-[var(--a-radius-sm)] border border-[var(--a-line)] bg-[var(--a-raised)] px-3 py-2.5">
                <span
                  className="h-6 w-6 shrink-0 rounded-full border border-[var(--a-line-strong)]"
                  style={{ backgroundColor: newColorHexCode || '#808080' }}
                  aria-hidden="true"
                />
                <span className="min-w-0 text-[12.5px] text-[var(--a-muted)]">
                  {newColorName.trim() || 'Màu chưa đặt tên'}
                </span>
                <span className="ml-auto text-[12px] tabular-nums text-[var(--a-faint)]">
                  {pickerValue}
                </span>
              </div>

              {addColorError && (
                <p role="alert" className="text-[12px] text-[var(--a-danger)]">
                  {addColorError}
                </p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCloseColorModal}
                disabled={isAddingColor}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSaveColor}
                loading={isAddingColor}
              >
                {isAddingColor ? 'Đang lưu…' : isEditingColor ? 'Lưu thay đổi' : 'Thêm màu'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title="Xóa ảnh này?"
        description="Ảnh sẽ bị xóa khỏi sản phẩm và không thể khôi phục."
        confirmLabel="Xóa ảnh"
        loading={removingImage}
        onCancel={() => {
          if (!removingImage) setPendingRemove(null);
        }}
        onConfirm={confirmRemoveImage}
      />
    </div>
  );
}
