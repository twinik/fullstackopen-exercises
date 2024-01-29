function BlogsList({ blogs, handleDelete }) {
  return (
    <>
      {blogs.map((blog) => (
        <div
          key={blog.id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p style={{ marginRight: "10px" }}>
            &quot;{blog.title}&quot; by &apos;{blog.author}&apos;
          </p>
          <button onClick={() => handleDelete(blog.id)}>delete</button>
        </div>
      ))}
    </>
  );
}

export default BlogsList;
