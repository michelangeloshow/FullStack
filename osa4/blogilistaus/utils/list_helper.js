var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((a, b) => {
    return a + b['likes']
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  const mostLikes = blogs.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  })
  return {
    title: mostLikes.title,
    author: mostLikes.author,
    likes: mostLikes.likes,
  }
}

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author)
  const blogsByAuthor = _.countBy(authors)
  const mostBlogs = Math.max(...Object.values(blogsByAuthor))
  const authorWithMostBlogs = Object.keys(blogsByAuthor).find(
    (key) => blogsByAuthor[key] === mostBlogs
  )

  return {
    author: authorWithMostBlogs,
    blogs: mostBlogs,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
