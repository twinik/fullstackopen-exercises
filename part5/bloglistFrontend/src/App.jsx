import { useState, useEffect, useRef } from "react";
import BlogForm from "./Components/BlogForm";
import LoginForm from "./Components/LoginForm";
import Blog from "./Components/Blog";
import Notification from "./Components/Notification";
import Togglable from "./Components/Togglable";
import blogsService from "./Services/blogs";
import loginService from "./Services/login";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogsService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogsService.getAll().then((blogs) => setBlogs(blogs));
    } else {
      setBlogs([]);
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogsService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      notification("Wrong credentials", "error");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBloglistUser");
    setUser(null);
  };

  const handleAdd = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogsService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      notification(`Added ${newBlog.title} by ${newBlog.author}`, "success");
    } catch (exception) {
      notification(exception.response.data.error, "error");
    }
  };

  const handleLike = async (id) => {
    const blog = blogs.find((p) => p.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      const returnedBlog = await blogsService.update(id, changedBlog);
      setBlogs(blogs.map((p) => (p.id !== id ? p : returnedBlog)));
    } catch (exception) {
      notification(exception.response.data.error, "error");
    }
  };

  const handleDelete = async (id) => {
    const blog = blogs.find((p) => p.id === id);
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}`)) {
      try {
        await blogsService.remove(id);
        setBlogs(blogs.filter((p) => p.id !== id));
        notification(`Deleted "${blog.title}"`, "success");
      } catch (exception) {
        notification(exception.response.data.error, "error");
      }
    }
  };

  const notification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const byLikes = (b1, b2) => b2.likes - b1.likes;

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} type={notificationType} />
      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Togglable>
      ) : (
        <>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <h3>Create new</h3>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm handleAdd={handleAdd} />
          </Togglable>
          {blogs.sort(byLikes).map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              user={user}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
