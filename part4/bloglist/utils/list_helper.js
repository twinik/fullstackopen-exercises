var lodash = require("lodash");

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (favorite, blog) => {
    return favorite.likes > blog.likes ? favorite : blog;
  };

  return blogs.reduce(reducer, {});
};

const mostBlogs = (blogs) => {
  const authors = lodash.countBy(blogs, "author");
  const author = lodash.maxBy(Object.keys(authors), (o) => authors[o]);
  return {
    author,
    blogs: authors[author],
  };
};

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs, "author");
  const author = lodash.maxBy(Object.keys(authors), (o) =>
    lodash.sumBy(authors[o], "likes")
  );
  return {
    author,
    likes: lodash.sumBy(authors[author], "likes"),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
