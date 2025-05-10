'use client'

import React from 'react';
import CKEditorComponent from './CKEditorComponent';

/**
 * A simplified wrapper around CKEditorComponent.
 * This component exists for backward compatibility.
 */
const CustomEditor = ({ 
  initialData = '<p>Start writing...</p>', 
  onChange,
  readOnly = false,
  height = '400px'
}) => {
  return (
    <CKEditorComponent
      initialContent={initialData}
      onChange={onChange}
      editable={!readOnly}
      height={height}
      showStatistics={false}
      className="custom-editor-legacy"
    />
  );
};

export default CustomEditor;
