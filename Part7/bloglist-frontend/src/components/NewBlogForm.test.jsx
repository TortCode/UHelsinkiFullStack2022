import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";

describe("when rendering the new blog form,", () => {
  test("calls event handler with correct details when a new blog is created", async () => {
    const mockCreateBlog = jest.fn();
    const { container } = render(<NewBlogForm createBlog={mockCreateBlog} />);

    const user = userEvent.setup();

    const titleInput = container.querySelector('input[name="title"]');
    await user.type(titleInput, "Test Title");
    const authorInput = container.querySelector('input[name="author"]');
    await user.type(authorInput, "Test Author");
    const urlInput = container.querySelector('input[name="url"]');
    await user.type(urlInput, "Test URL");

    const button = screen.getByText("create");
    await user.click(button);

    const doc = mockCreateBlog.mock.calls[0][0];
    expect(doc.title).toBe("Test Title");
    expect(doc.author).toBe("Test Author");
    expect(doc.url).toBe("Test URL");
  });
});
