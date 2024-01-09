import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { NewBlogForm } from './NewBlogForm'
import userEvent from '@testing-library/user-event'

describe('<NewBlogForm/>', () => {
  test('gives the callback function right values when submitting form', async () => {
    const createNewBlog = jest.fn()
    const user = userEvent.setup()
    const { container } = render(<NewBlogForm createNewBlog={createNewBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const submitButton = container.querySelector('#submit-button')

    await user.type(titleInput, 'testTitle')
    await user.type(authorInput, 'testAuthor')
    await user.type(urlInput, 'testUrl')
    await user.click(submitButton)

    const call = createNewBlog.mock.calls[0][0]

    expect(call).toStrictEqual({
      author: 'testAuthor',
      title: 'testTitle',
      url: 'testUrl',
    })
  })
})
