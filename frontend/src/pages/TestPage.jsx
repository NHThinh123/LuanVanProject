import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TestPage = () => {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    // Khởi tạo Quill editor
    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
      placeholder: "Bắt đầu nhập tại đây...",
    });

    // Cập nhật nội dung khi có thay đổi
    quillRef.current.on("text-change", () => {
      setContent(quillRef.current.root.innerHTML);
    });

    // Cleanup khi component unmount
    return () => {
      quillRef.current = null;
    };
  }, []);

  const handleSubmit = () => {
    console.log("Nội dung đã submit:", content);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Thử nghiệm Quill Editor</h1>
      <div className="mb-4">
        <div ref={editorRef} className="border rounded h-64" />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Submit
      </button>
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Nội dung đã lưu</h2>
        <div
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default TestPage;
