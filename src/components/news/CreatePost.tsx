import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { createNews } from "../../store/newsSlice";
import { AppDispatch } from "../../store";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const attachmentPaths: string[] = await Promise.all(
        attachments.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
      
          const response = await axios.post<{ path: string }>(
            "http://localhost:8080/api/files/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
      
          return response.data.path;
        })
      );

    dispatch(createNews({ content, attachments: attachmentPaths }));
    setContent("");
    setAttachments([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <input type="file" multiple onChange={handleFileChange} />
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;