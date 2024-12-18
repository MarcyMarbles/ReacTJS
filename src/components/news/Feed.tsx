import React, {useEffect, useState, FormEvent, ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {addNewsFromSocket, fetchAllNews} from "../../store/newsSlice";
import Cookies from "js-cookie";
import {apiFiles, apiPost} from "../../api/api";

const Feed = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {news, loading, error} = useSelector((state: RootState) => state.news);

    const [newContent, setNewContent] = useState("");
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchAllNews());

        const socket = new WebSocket("ws://localhost:8080/ws");
        socket.onmessage = (event) => {
            const newPost = JSON.parse(event.data);
            dispatch(addNewsFromSocket(newPost));
        };

        return () => {
            socket.close();
        };
    }, [dispatch]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles(Array.from(e.target.files));
        }
    };

    const uploadFiles = async (files: File[]): Promise<any[]> => {
        const uploadedFiles: any[] = [];

        for (const file of files) {
            // Extract extension from filename
            const extension = file.name.split('.').pop() || '';
            // Use file's type (MIME type) directly
            const type = file.type || 'application/octet-stream';
            const metadata = {
                name: file.name,    // Use the file's actual name
                type: type,         // MIME type from the File object
                extension: extension,
                userId: Cookies.get("id"),
            };


            const fileFormData = new FormData();
            fileFormData.append("metadata", new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
            fileFormData.append("file", file);
            fileFormData.append("isAvatar", "false");

            const response = await fetch(`${apiFiles}?isAvatar=false`, {
                method: "POST",
                body: fileFormData,
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            });

            if (!response.ok) {
                console.error("Failed to upload file:", file.name);
                throw new Error(`File upload failed for ${file.name}`);
            }

            const fileDescriptor = await response.json();
            uploadedFiles.push(fileDescriptor);
        }

        return uploadedFiles;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newContent.trim() && newFiles.length === 0) {
            return; // No content or files
        }

        setIsSubmitting(true);

        try {
            // First upload the files
            let fileDescriptors: any[] = [];
            if (newFiles.length > 0) {
                fileDescriptors = await uploadFiles(newFiles);
            }

            const postPayload = {
                content: newContent,
                attachments: fileDescriptors.map(fd => fd.id || fd.url)
            };
            const newsPostDTO = {
                newsDTO: {
                    content: postPayload.content,
                },
                ids: postPayload.attachments,
            };
            console.log("Post payload:", newsPostDTO);

            console.log("Final request body:", JSON.stringify(newsPostDTO));
            const response = await fetch(apiPost, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                    "userId": Cookies.get("id") || "0",
                },
                body: JSON.stringify(newsPostDTO),
            });

            if (!response.ok) {
                console.error("Failed to create a new post");
            } else {
                setNewContent("");
                setNewFiles([]);
                dispatch(fetchAllNews());
            }
        } catch (error) {
            console.error("Error while creating a new post:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="feed_container">
            {/* Post creation form */}
            <form onSubmit={handleSubmit} style={{marginBottom: "20px"}} className="feed_post_create">
                <textarea
                    placeholder="What's happening?"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    style={{width: "100%", height: "60px", marginBottom: "10px", borderRadius: '5px', padding: '5px'}}
                ></textarea>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{display: "block", marginBottom: "10px"}}
                        className="input_upload"
                    />
                    <button type="submit" disabled={isSubmitting} className="btn btn-success">
                        {isSubmitting ? "Posting..." : "Post"}
                    </button>
            </form>

            {/* Display of posts */}
            {Array.isArray(news) ? (
                news.map((post) => (
                    <div key={post.id} className="post" style={{marginBottom: "20px"}}>
                        <div className="post_header">
                            <img
                                src="https://via.placeholder.com/50"
                                alt="Avatar"
                            />
                            <div>
                                <h3>{post.author.username}</h3>
                                <p>{post.content}</p>
                            </div>
                        </div>
                        
                        {post.attachments.map((attachment: string) => (
                            <img
                                src={attachment}
                                alt="attachment"
                                key={attachment}
                                style={{maxWidth: "200px", display: "block", marginTop: '15px'}}
                            />
                        ))}
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default Feed;
