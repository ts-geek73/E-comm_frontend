import { useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

// interface MyEditorProps {
//   value: string;
//   onChange: (value: string) => void;
// }

const MyEditor = ({ value, onChange }) => {
  const handleEditorChange = (content) => {
    // Update the form value whenever the editor content changes
    onChange(content);
  };

  return (
    <Editor
      apiKey="4oiueq0jglz8o9rxpwq9odc981cwdw834gliu0gwg3o2tl16" // Your TinyMCE API key
      initialValue={value} // Set initial content from the form value
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 
          'preview', 'searchreplace', 'wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic | alignleft aligncenter alignright | outdent indent | link image',
      }}
      onEditorChange={handleEditorChange} // Update form state on content change
    />
  );
};

export default MyEditor;
