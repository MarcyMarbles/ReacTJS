import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addNewsFromSocket, fetchAllNews } from "../../store/newsSlice";
import Cookies from "js-cookie";
import { apiFiles, apiPost } from "../../api/api";
// If you are using React Icons:
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Attachment {
    id: string;
    userId: string;
    name: string;
}

const Feed = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { news, loading, error } = useSelector((state: RootState) => state.news);

    const [newContent, setNewContent] = useState("");
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track which comment sections are open
    const [openComments, setOpenComments] = useState<{ [postId: string]: boolean }>(
        {}
    );

    // Track new comment text for each post
    const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>(
        {}
    );

    // ---------------------------------
    // 1. Load All News & Handle WebSocket
    // ---------------------------------
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

    // ---------------------------------
    // 2. Handle File Upload
    // ---------------------------------
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles(Array.from(e.target.files));
        }
    };

    const uploadFiles = async (files: File[]): Promise<any[]> => {
        const uploadedFiles: any[] = [];

        for (const file of files) {
            const extension = file.name.split(".").pop() || "";
            const type = file.type || "application/octet-stream";
            const metadata = {
                name: file.name,
                type: type,
                extension: extension,
                userId: Cookies.get("id"),
            };

            const fileFormData = new FormData();
            fileFormData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
            fileFormData.append("file", file);
            fileFormData.append("isAvatar", "false");

            const response = await fetch(`${apiFiles}?isAvatar=false`, {
                method: "POST",
                body: fileFormData,
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
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

    // ---------------------------------
    // 3. Submit New Post
    // ---------------------------------
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newContent.trim() && newFiles.length === 0) {
            return; // No content or files
        }

        setIsSubmitting(true);

        try {
            // 3.1. First upload the files
            let fileDescriptors: any[] = [];
            if (newFiles.length > 0) {
                fileDescriptors = await uploadFiles(newFiles);
            }

            // 3.2. Construct post payload
            const postPayload = {
                content: newContent,
                attachments: fileDescriptors.map((fd) => fd.id || fd.url),
            };
            const newsPostDTO = {
                newsDTO: {
                    content: postPayload.content,
                },
                ids: postPayload.attachments,
            };

            // 3.3. Send Post request
            const response = await fetch(apiPost, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                    userId: Cookies.get("id") || "0",
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

    // ---------------------------------
    // 4. Handle Like/Dislike (Placeholder)
    // ---------------------------------
    const handleLike = async (postId: string) => {
        try {
            // Example placeholder: Adjust to your actual endpoint or Redux action
            await fetch(`http://localhost:8080/api/news/${postId}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                    "userId" : Cookies.get("id") || "0",
                },
            });
            // Refresh the news to see updated likes
            dispatch(fetchAllNews());
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    // ---------------------------------
    // 5. Toggle Comments Section
    // ---------------------------------
    const toggleComments = (postId: string) => {
        setOpenComments((prevState) => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    // ---------------------------------
    // 6. Submit a Comment (Placeholder)
    // ---------------------------------
    const handleCommentSubmit = async (e: FormEvent, postId: string) => {
        e.preventDefault();
        const commentText = newCommentText[postId]?.trim();

        if (!commentText) return;

        try {
            // Example placeholder: Adjust to your actual endpoint or Redux action
            await fetch(`http://localhost:8080/api/news/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                body: JSON.stringify({ content: commentText }),
            });
            // Clear the comment input
            setNewCommentText((prev) => ({ ...prev, [postId]: "" }));

            // Refresh the news to see updated comments
            dispatch(fetchAllNews());
        } catch (err) {
            console.error("Error posting comment:", err);
        }
    };

    // ---------------------------------
    // 7. UI Rendering
    // ---------------------------------
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Sort by descending date
    const sortedNews = [...news].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="feed_container">
            {/* Post creation form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }} className="feed_post_create">
        <textarea
            placeholder="What's happening?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ width: "100%", height: "60px", marginBottom: "10px", borderRadius: "5px", padding: "5px" }}
        />
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "block", marginBottom: "10px" }}
                    className="input_upload"
                />
                <button type="submit" disabled={isSubmitting} className="btn btn-success">
                    {isSubmitting ? "Posting..." : "Post"}
                </button>
            </form>

            {/* Display of posts */}
            {Array.isArray(sortedNews) ? (
                sortedNews.map((post) => (
                    <div key={post.id} className="post" style={{ marginBottom: "20px" }}>
                        <div className="post_header">
                            <img
                                src={`http://localhost:8080/api/files/users/${post.author.id}/${post.author.avatar.name}`}
                                alt="Avatar"
                            />
                            <div>
                                <h3>{post.author.username}</h3>
                            </div>
                        </div>
                        <p>{post.content}</p>

                        {post.attachments.map((attachment: Attachment) => (
                            <img
                                src={`http://localhost:8080/api/files/users/${attachment.userId}/${attachment.name}`}
                                alt="attachment"
                                key={attachment.name}
                                style={{ maxWidth: "200px", display: "block", marginTop: "15px" }}
                            />
                        ))}

                        {/* Like and Comment buttons */}
                        <div className="post_actions" style={{ marginTop: "10px" }}>
                            {/* Like Button (Heart) */}
                            <button
                                onClick={() => handleLike(post.id)}
                                style={{ cursor: "pointer", background: "none", border: "none", marginRight: "15px" }}
                            >
                                {/*
                  Example logic to show a filled heart if the user has liked the post.
                  This requires you to know if the current user is in `post.likes`.
                  For now, we’ll just show a regular heart always.
                */}
                                <FaRegHeart size={20} style={{ color: "red", marginRight: "5px" }} />
                                <span>{post.likesCount}</span>
                            </button>

                            {/* Toggle Comments Section */}
                            <button
                                onClick={() => toggleComments(post.id)}
                                style={{ cursor: "pointer", background: "none", border: "1px solid #ccc", borderRadius: "4px" }}
                            >
                                Comments ({post.commentsCount})
                            </button>
                        </div>

                        {/* Comment Section */}
                        {openComments[post.id] && (
                            <div style={{ marginTop: "10px", padding: "10px", background: "#f1f1f1" }}>
                                {/* List existing comments */}
                                {post.comments.map((comment: any) => (
                                    <div key={comment.id} style={{ marginBottom: "10px" }}>
                                        <b>{comment.author.username}:</b> {comment.content}
                                    </div>
                                ))}

                                {/* Add new comment */}
                                <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        value={newCommentText[post.id] || ""}
                                        onChange={(e) =>
                                            setNewCommentText((prev) => ({
                                                ...prev,
                                                [post.id]: e.target.value,
                                            }))
                                        }
                                        style={{ width: "80%", marginRight: "10px" }}
                                    />
                                    <button type="submit" className="btn btn-primary">
                                        Post
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default Feed;
