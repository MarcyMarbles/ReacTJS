import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addNewsFromSocket, fetchAllNews } from "../../store/newsSlice";

const Feed = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { news, loading, error } = useSelector((state: RootState) => state.news);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {news.map((post: { id: React.Key; author: { username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal; }; content: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal; attachments: any[]; }) => (
        <div key={post.id} className="post">
          <h3>{post.author.username}</h3>
          <p>{post.content}</p>
          {post.attachments.map((attachment) => (
            <img src={attachment} alt="attachment" key={attachment} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Feed;