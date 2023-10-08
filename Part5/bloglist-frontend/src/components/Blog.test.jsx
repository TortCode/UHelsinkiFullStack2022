import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('when rendering blog,', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test URL',
    likes: 1729,
    user: {
      id: 'Test Id',
      name: 'Test Name',
    },
  };

  test('shows blog title and author by default but not url or likes', async () => {
    render(
      <Blog
        blog={blog}
        updateBlog={() => {}}
        deleteBlog={() => {}}
        showRemove={false}
      />,
    );

    expect(screen.queryByText(blog.title, { exact: false })).not.toBeNull();
    expect(screen.queryByText(blog.author, { exact: false })).not.toBeNull();
    expect(screen.queryByText(blog.url)).toBeNull();
    expect(screen.queryByText(blog.likes)).toBeNull();
  });

  test('shows url and likes when view button is clicked', async () => {
    render(
      <Blog
        blog={blog}
        updateBlog={() => {}}
        deleteBlog={() => {}}
        showRemove={false}
      />,
    );

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    expect(screen.queryByText(blog.url, { exact: false })).not.toBeNull();
    expect(screen.queryByText(blog.likes, { exact: false })).not.toBeNull();
  });

  test('calls event handles twice when like button is clicked twice', async () => {
    const mockUpdateBlog = jest.fn();
    render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={() => {}}
        showRemove={false}
      />,
    );

    const user = userEvent.setup();

    const viewButton = screen.getByText('view');
    await user.click(viewButton);

    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockUpdateBlog.mock.calls).toHaveLength(2);
  });
});
