import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog/>', () => {
  let removeBlog
  let editBlog

  beforeEach(() => {
    const user = {
      username: 'michel',
      name: 'michel',
    }

    const blog = {
      title: 'Testing blog content',
      author: 'Test Author',
      url: 'www.test.com',
      user: {
        username: 'michel',
        name: 'michel',
      },
      likes: 123,
    }

    removeBlog = jest.fn()
    editBlog = jest.fn()

    render(
      <Blog
        blog={blog}
        user={user}
        editBlog={editBlog}
        updateBlogList={removeBlog}
      />
    )
  })

  test('renders author and title by default', () => {
    const title = screen.getByText('Testing blog content', { exact: false })
    const author = screen.getByText('Test author', { exact: false })
    expect(title).toBeDefined()
    expect(author).toBeDefined()
  })

  test('doesnt render likes or url by default', () => {
    const likes = screen.queryByText('123')
    const url = screen.queryByText('www.test.com')
    expect(likes).toBeNull()
    expect(url).toBeNull()
  })

  test('renders likes and url when expanded', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likes = screen.getByText('123', { exact: false })
    const url = screen.getByText('www.test.com', { exact: false })
    expect(likes).toBeDefined()
    expect(url).toBeDefined()
  })

  test('pressing like-button calls callback function correctly', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('view')
    await user.click(showButton)

    const likeButton = screen.queryByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(editBlog.mock.calls).toHaveLength(2)
  })
})
