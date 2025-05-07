import { Editor } from "@tinymce/tinymce-react";
const MyEditor = ({ value, onChange }) => {
  const handleEditorChange = (content) => {
    
    onChange(content);
  };

  return (
    <Editor
      apiKey="4oiueq0jglz8o9rxpwq9odc981cwdw834gliu0gwg3o2tl16" 
      initialValue={value}
      init={{
        height: 500,
        directionality: 'ltr', 
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'preview', 'searchreplace', 'wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic | alignleft aligncenter alignright | outdent indent | link image',
          content_style: 'body { direction: ltr; }',
        }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default MyEditor;
