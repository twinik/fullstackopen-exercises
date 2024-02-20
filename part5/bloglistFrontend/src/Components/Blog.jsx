import { useState } from "react";

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visibleDetails, setVisibleDetails] = useState(false);

  const blogStyle = {
    marginTop: "5px",
    padding: "10px",
    border: "solid",
    borderWidth: 1,
    width: "15rem",
  };

  const Details = ({ blog, handleDelete }) => {
    console.log("BLOG.USER", blog.user);
    return (
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
        <p>
          {blog.likes} likes{" "}
          <button onClick={() => handleLike(blog.id)}>like</button>
        </p>
        <p>added by {blog.user.name}</p>
        {user.username === blog.user.username && (
          <button onClick={() => handleDelete(blog.id)}>remove</button>
        )}
      </div>
    );
  };

  return (
    <div style={blogStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ marginBlock: 0 }}>
          &quot;{blog.title}&quot; by &apos;{blog.author}&apos;
        </h4>
        <button onClick={() => setVisibleDetails(!visibleDetails)}>
          {visibleDetails ? "hide" : "view"}
        </button>
      </div>
      {visibleDetails && <Details blog={blog} handleDelete={handleDelete} />}
    </div>
  );
};

export default Blog;
