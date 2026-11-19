# CSS Modules - Hướng dẫn sử dụng

## Tổng quan

Dự án này sử dụng CSS Modules để tách riêng các style ra khỏi component, giúp mã nguồn rõ ràng, dễ bảo trì và tái sử dụng.

## Cấu trúc thư mục

```
src/styles/modules/
├── Home.module.css          # Styles cho trang chủ
├── Navbar.module.css        # Styles cho navigation bar
├── Footer.module.css        # Styles cho footer
├── CurtainCard.module.css   # Styles cho card sản phẩm
├── BannerSlider.module.css  # Styles cho banner slider
└── README.md               # File hướng dẫn này
```

## Cách sử dụng

### 1. Import CSS Module

```javascript
import styles from '@/styles/modules/ComponentName.module.css';
```

### 2. Sử dụng trong component

```javascript
// Thay vì
<div className="bg-white rounded-lg shadow-md">

// Sử dụng
<div className={styles.card}>
```

### 3. Kết hợp nhiều class

```javascript
// Kết hợp với Tailwind CSS
<div className={`${styles.card} ${isActive ? styles.active : ''}`}>

// Kết hợp với điều kiện
<div className={`${styles.button} ${isPrimary ? styles.primary : styles.secondary}`}>
```

## Quy tắc đặt tên

### 1. Tên file
- Sử dụng PascalCase cho tên component: `ComponentName.module.css`
- Ví dụ: `Home.module.css`, `Navbar.module.css`

### 2. Tên class
- Sử dụng camelCase cho tên class: `.cardContainer`, `.navItem`
- Tránh sử dụng kebab-case: `.card-container` ❌

### 3. Cấu trúc CSS
```css
/* Component chính */
.component {
  /* Base styles */
}

/* Sub-components */
.componentHeader {
  /* Header styles */
}

.componentContent {
  /* Content styles */
}

/* States */
.componentActive {
  /* Active state */
}

.componentHovered {
  /* Hover state */
}

/* Responsive */
@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}
```

## Lợi ích

### 1. Tách biệt concerns
- Style được tách riêng khỏi logic component
- Dễ dàng tìm và chỉnh sửa style

### 2. Scoped styles
- CSS Modules tự động tạo unique class names
- Tránh xung đột style giữa các component

### 3. Tái sử dụng
- Có thể import và sử dụng lại styles
- Dễ dàng tạo design system

### 4. Performance
- Chỉ load CSS cần thiết cho component
- Tree-shaking tự động loại bỏ unused styles

## Best Practices

### 1. Tổ chức CSS
```css
/* 1. Layout */
.container {
  /* Container styles */
}

/* 2. Components */
.card {
  /* Card styles */
}

/* 3. States */
.card:hover {
  /* Hover styles */
}

/* 4. Responsive */
@media (min-width: 768px) {
  .card {
    /* Responsive styles */
  }
}
```

### 2. Naming Convention
```css
/* Component chính */
.navbar { }

/* Sub-components */
.navbarContainer { }
.navbarLogo { }
.navbarMenu { }

/* States */
.navbarScrolled { }
.navbarOpen { }

/* Elements */
.navbarItem { }
.navbarLink { }
.navbarButton { }
```

### 3. Responsive Design
```css
/* Mobile first approach */
.component {
  /* Mobile styles */
}

@media (min-width: 640px) {
  .component {
    /* Small tablet */
  }
}

@media (min-width: 768px) {
  .component {
    /* Tablet */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop */
  }
}
```

## Migration từ Tailwind

### Trước khi migration
```javascript
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all">
  <h2 className="text-xl font-bold text-gray-900 mb-2">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### Sau khi migration
```javascript
import styles from '@/styles/modules/Component.module.css';

<div className={styles.card}>
  <h2 className={styles.title}>Title</h2>
  <p className={styles.description}>Description</p>
</div>
```

```css
/* Component.module.css */
.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(17 24 39);
  margin-bottom: 0.5rem;
}

.description {
  color: rgb(75 85 99);
}
```

## Troubleshooting

### 1. Class không được apply
- Kiểm tra tên class có đúng không
- Đảm bảo import styles đúng cách
- Kiểm tra CSS có syntax error không

### 2. Style bị override
- Sử dụng CSS specificity cao hơn
- Thêm `!important` nếu cần thiết
- Kiểm tra thứ tự import CSS

### 3. Responsive không hoạt động
- Đảm bảo media queries đúng syntax
- Kiểm tra breakpoints có đúng không
- Test trên nhiều kích thước màn hình

## Tài liệu tham khảo

- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [Next.js CSS Modules](https://nextjs.org/docs/basic-features/built-in-css-support#css-modules)
- [CSS Modules vs Styled Components](https://blog.logrocket.com/css-modules-vs-styled-components/)
