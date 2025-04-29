'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import { uploadImage } from '@/lib/api';

const BlockNoteEditor = ({ initialContent, onChange, editable = true }) => {
  // Create the editor instance with file upload handlers
  const editor = useCreateBlockNote({
    initialContent: initialContent,
    uploadFile: async (file) => {
      try {
        // Use your existing uploadImage function
        const response = await uploadImage(file);
        return response.url;
      } catch (error) {
        console.error('Error uploading file:', error);
        return null;
      }
    }
  });

  return (
    <div className={`border rounded-lg overflow-hidden ${editable ? 'min-h-[300px]' : ''}`}>
      <BlockNoteView 
        editor={editor} 
        theme="light" 
        editable={editable}
        onChange={() => {
          const content = editor.document;
          console.log('Editor content changed:', content);
          onChange && onChange(content);
        }} 
      />
    </div>
  );
};

export default BlockNoteEditor; 