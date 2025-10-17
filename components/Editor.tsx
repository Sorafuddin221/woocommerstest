'use client';

import React from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  return (
    <TinyMCEEditor
      apiKey="jinv9suq53hvoazfy9dayv42ue9u5c5371jn9rbsoggawqx3"
      value={content}
      onEditorChange={(newContent) => onChange(newContent)}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'link image | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  );
};

export default Editor;
