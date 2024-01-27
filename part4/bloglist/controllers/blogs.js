/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const logger = require("../utils/logger");
const Blog = require("../models/blog");
const User = require("../models/user");

// Try/catch no escritos por la biblioteca "express-async-errors"

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  logger.info("blogs successfully retrieved");
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    _id: body._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    __v: body.__v,
    user: user._id,
  });

  if (!blog.likes) {
    blog.likes = 0;
  }

  const savedBlog = await blog.save();
  logger.info(`blog ${blog.title} successfully saved`);

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    logger.info(`blog ${blog.title} successfully retrieved`);
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    _id: body._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    __v: body.__v,
  };

  if (!blog.likes) {
    blog.likes = 0;
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  logger.info(`blog ${blog.title} successfully updated`);
  response.json(updatedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  logger.info("blog successfully deleted");
  response.status(204).end();
});

module.exports = blogsRouter;
