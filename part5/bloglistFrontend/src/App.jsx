import { useState, useEffect } from "react";
import BlogForm from "./Components/BlogForm";
import LoginForm from "./Components/LoginForm";
import BlogsList from "./Components/BlogsList";
import Notification from "./Components/Notification";
import blogsService from "./Services/blogs";
import loginService from "./Services/login";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null);

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

  const handleAdd = async (event) => {
    event.preventDefault();
    const newBlog = { title: newTitle, author: newAuthor, url: newUrl };

    try {
      const returnedBlog = await blogsService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      notification(`Added ${newBlog.title} by ${newBlog.author}`, "success");
    } catch (exception) {
      notification(exception.response.data.error, "error");
    }
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  const handleDelete = async (id) => {
    const blog = blogs.find((p) => p.id === id);
    if (window.confirm(`Delete "${blog.title}"?`)) {
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

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} type={notificationType} />
      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      ) : (
        <>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <h3>Create new</h3>
          <BlogForm
            newTitle={newTitle}
            newAuthor={newAuthor}
            newUrl={newUrl}
            handleTitleChange={handleTitleChange}
            handleAuthorChange={handleAuthorChange}
            handleUrlChange={handleUrlChange}
            handleAdd={handleAdd}
          />
          <BlogsList blogs={blogs} handleDelete={handleDelete} />
        </>
      )}
    </div>
  );
}

export default App;
