'use client';

import { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { uploadImage } from '@/lib/api';
import { getContentStats, renderCKEditorContent } from '@/utils/ckeditorConverter';

// Custom upload adapter for handling image uploads
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then(file => {
        return uploadImage(file);
      })
      .then(response => {
        // Handle image URL from response
        let imageUrl = null;
        
        if (response && typeof response === 'object' && response.url) {
          imageUrl = response.url;
        } else if (response && typeof response === 'object' && response.default) {
          imageUrl = response.default;
        } else if (response && typeof response === 'string') {
          imageUrl = response;
        } else if (response && typeof response === 'object') {
          const possibleFields = ['link', 'path', 'src', 'data', 'location', 'file'];
          for (const field of possibleFields) {
            if (response[field]) {
              imageUrl = response[field];
              break;
            }
          }
        }
        
        // Convert relative URLs to absolute if needed
        if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('http')) {
          if (imageUrl.startsWith('/')) {
            imageUrl = `${window.location.origin}${imageUrl}`;
          } else {
            imageUrl = `${window.location.origin}/${imageUrl}`;
          }
        }
        
        if (!imageUrl) {
          return Promise.reject('Upload failed. URL not found in response.');
        }
        
        return {
          default: imageUrl
        };
      })
      .catch(error => {
        console.error('Image upload error:', error);
        return Promise.reject(error);
      });
  }

  abort() {
    // Handle abort operation if needed
  }
}

// Custom upload adapter plugin
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const CKEditorComponent = ({
  initialContent = '',
  onChange,
  editable = true,
  height = '400px',
  autosave = false,
  autosaveInterval = 30000,
  showStatistics = true,
  allowPreview = true,
  className = '',
  label
}) => {
  const editorRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [statistics, setStatistics] = useState({ words: 0, chars: 0, charsNoSpace: 0 });
  const [editorData, setEditorData] = useState(initialContent || '');
  const [theme, setTheme] = useState('light');

  // Detect theme preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Autosave functionality
  useEffect(() => {
    let autosaveTimer;
    
    if (autosave && editable && editorData) {
      autosaveTimer = setInterval(() => {
        localStorage.setItem('ckeditor_autosave', editorData);
      }, autosaveInterval);
    }
    
    return () => {
      if (autosaveTimer) clearInterval(autosaveTimer);
    };
  }, [autosave, autosaveInterval, editable, editorData]);

  // Update statistics when editorData changes
  useEffect(() => {
    if (showStatistics && editorData) {
      const stats = getContentStats(editorData);
      setStatistics(stats);
    }
  }, [editorData, showStatistics]);

  // Toggle preview mode
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className={`ckeditor-wrapper ${className} ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      {/* Optional label */}
      {label && <div className="editor-label">{label}</div>}
      
      {/* Editor toolbar */}
      <div className="editor-toolbar">
        {allowPreview && (
          <button 
            type="button" 
            onClick={togglePreviewMode} 
            className="preview-toggle-btn"
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
        )}
      </div>
      
      {/* Main editor area */}
      {!isPreviewMode ? (
        <div className="editor-container" style={{ height }}>
          {isLoading && <div className="editor-loading">Loading editor...</div>}
          
          <div className="ckeditor5-container" style={{ opacity: isLoading ? 0 : 1 }}>
            {/* Using dynamic import for client-side only loading */}
            {typeof window !== 'undefined' && (
              <CKEditor
                editor={require('@ckeditor/ckeditor5-build-classic')}
                data={editorData}
                disabled={!editable}
                onReady={editor => {
                  editorRef.current = editor;
                  setIsLoading(false);
                  
                  // Restore autosaved content if needed
                  if (autosave && !initialContent) {
                    const savedContent = localStorage.getItem('ckeditor_autosave');
                    if (savedContent) {
                      editor.setData(savedContent);
                    }
                  }
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setEditorData(data);
                  if (onChange) {
                    onChange(data);
                  }
                }}
                config={{
                  extraPlugins: [MyCustomUploadAdapterPlugin],
                  toolbar: {
                    items: [
                      'undo', 'redo',
                      '|',
                      'heading',
                      '|',
                      'bold', 'italic', 'underline', 'strikethrough',
                      '|',
                      'fontSize', 'fontColor', 'fontBackgroundColor',
                      '|',
                      'link', 'bulletedList', 'numberedList',
                      '|',
                      'alignment', 'indent', 'outdent',
                      '|',
                      'imageUpload',
                      '|',
                      'insertTable', 'blockQuote', 'codeBlock',
                      '|',
                      'horizontalLine'
                    ],
                    shouldNotGroupWhenFull: true
                  },
                  image: {
                    toolbar: [
                      'imageStyle:inline', 'imageStyle:block', 'imageStyle:side',
                      '|',
                      'toggleImageCaption', 'imageTextAlternative',
                      '|',
                      'linkImage'
                    ]
                  },
                  table: {
                    contentToolbar: [
                      'tableColumn', 'tableRow', 'mergeTableCells'
                    ]
                  },
                  heading: {
                    options: [
                      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                      { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                      { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                      { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
                    ]
                  },
                  placeholder: 'Start writing...',
                  language: 'en',
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div 
          className="preview-container"
          style={{ height, overflow: 'auto' }}
          dangerouslySetInnerHTML={{ __html: renderCKEditorContent(editorData) }}
        />
      )}
      
      {/* Statistics footer */}
      {showStatistics && (
        <div className="editor-statistics">
          <span>{statistics.words} words</span>
          <span>{statistics.chars} characters</span>
          <span>{statistics.charsNoSpace} characters (no spaces)</span>
        </div>
      )}
      
      <style jsx>{`
        .ckeditor-wrapper {
          display: flex;
          flex-direction: column;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .ckeditor-wrapper.dark-theme {
          border-color: #444;
          color: #f5f5f5;
          background: #1e1e1e;
        }
        
        .editor-label {
          padding: 8px 12px;
          font-weight: 600;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }
        
        .dark-theme .editor-label {
          background: #2d2d2d;
          border-color: #444;
        }
        
        .editor-toolbar {
          display: flex;
          justify-content: flex-end;
          padding: 8px;
          background: #f5f5f5;
          border-bottom: 1px solid #ddd;
        }
        
        .dark-theme .editor-toolbar {
          background: #2d2d2d;
          border-color: #444;
        }
        
        .preview-toggle-btn {
          padding: 6px 12px;
          background: #4b7bec;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .preview-toggle-btn:hover {
          background: #3867d6;
        }
        
        .editor-container {
          position: relative;
          flex: 1;
          min-height: 200px;
        }
        
        .editor-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          z-index: 1;
        }
        
        .dark-theme .editor-loading {
          background: rgba(30, 30, 30, 0.8);
        }
        
        .ckeditor5-container {
          height: 100%;
          transition: opacity 0.3s;
        }
        
        .preview-container {
          padding: 16px;
          background: white;
        }
        
        .dark-theme .preview-container {
          background: #1e1e1e;
          color: #f5f5f5;
        }
        
        .editor-statistics {
          display: flex;
          gap: 16px;
          padding: 8px 12px;
          font-size: 0.85rem;
          color: #666;
          background: #f9f9f9;
          border-top: 1px solid #ddd;
        }
        
        .dark-theme .editor-statistics {
          background: #2d2d2d;
          color: #aaa;
          border-color: #444;
        }
        
        /* CKEditor Dark Theme Customization */
        .dark-theme :global(.ck.ck-editor__main) {
          background: #1e1e1e;
          color: #f5f5f5;
        }
        
        .dark-theme :global(.ck.ck-editor__editable) {
          background: #1e1e1e;
          color: #f5f5f5;
          border-color: #444 !important;
        }
        
        .dark-theme :global(.ck.ck-toolbar) {
          background: #2d2d2d;
          border-color: #444 !important;
        }
        
        .dark-theme :global(.ck.ck-button),
        .dark-theme :global(.ck.ck-dropdown__button) {
          color: #f5f5f5;
        }
        
        .dark-theme :global(.ck.ck-list) {
          background: #2d2d2d;
        }
        
        .dark-theme :global(.ck.ck-list__item) {
          color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default CKEditorComponent; 