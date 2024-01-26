const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

// Try/catch no escritos por la biblioteca "express-async-errors"

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  logger.info("blogs successfully retrieved");
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const blog = new Blog({
    _id: body._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    __v: body.__v,
  });

  if (!blog.likes) {
    blog.likes = 0;
  }

  const savedBlog = await blog.save();
  logger.info(`blog ${blog.title} successfully saved`);
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
