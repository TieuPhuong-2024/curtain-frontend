'use client';

import { useEffect, useState } from 'react';
import 'ckeditor5/ckeditor5.css';

import { uploadImage, uploadVideo } from '@/lib/api';

class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then((file) => (file.type.startsWith('video/') ? uploadVideo(file) : uploadImage(file)))
      .then((response) => {
        if (response?.url) return { default: response.url };
        return Promise.reject(new Error('Tải tệp thất bại'));
      });
  }

  abort() {}
}

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new UploadAdapter(loader);
}

function buildPlugins(ck) {
  return [
    ck.Essentials,
    ck.Autoformat,
    ck.Paragraph,
    ck.Heading,
    ck.Bold,
    ck.Italic,
    ck.Link,
    ck.List,
    ck.BlockQuote,
    ck.Table,
    ck.TableToolbar,
    ck.Image,
    ck.ImageCaption,
    ck.ImageStyle,
    ck.ImageToolbar,
    ck.ImageTextAlternative,
    ck.ImageResize,
    ck.ImageUpload,
    ck.MediaEmbed,
    ck.PasteFromOffice,
    ck.TextTransformation,
  ];
}

export default function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung…' }) {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      import('@ckeditor/ckeditor5-react'),
      import('ckeditor5'),
    ]).then(([reactModule, ck]) => {
      if (!active) return;
      setEditor({
        CKEditor: reactModule.CKEditor,
        ClassicEditor: ck.ClassicEditor,
        plugins: buildPlugins(ck),
      });
    });

    return () => {
      active = false;
    };
  }, []);

  if (!editor) {
    return (
      <div className="flex h-44 items-center justify-center rounded-[var(--a-radius-sm)] border border-dashed border-[var(--a-line-strong)] bg-[var(--a-raised)] text-[13px] text-[var(--a-muted)]">
        Đang tải trình soạn thảo…
      </div>
    );
  }

  const { CKEditor, ClassicEditor, plugins } = editor;

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event, instance) => onChange(instance.getData())}
      config={{
        licenseKey: 'GPL',
        placeholder,
        plugins,
        extraPlugins: [CustomUploadAdapterPlugin],
        toolbar: {
          items: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'insertTable',
            '|',
            'imageUpload',
            'mediaEmbed',
            '|',
            'undo',
            'redo',
          ],
        },
        image: {
          toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
        },
      }}
    />
  );
}
