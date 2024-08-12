import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from './Todo'

test('noncompleted todo rendered', async () => {
  const todo = {
    text: 'sample todo text',
    done: false
  }

  const mockDelete = vi.fn()
  const mockComplete = vi.fn()

  render(<Todo todo={todo} handleClickComplete={mockComplete} handleClickDelete={mockDelete} />)

  screen.getByText('sample todo text')
  screen.getByText('This todo is not done')

  const user = userEvent.setup()

  const deleteButton = screen.getByText('Delete')
  await user.click(deleteButton)
  expect(mockDelete.mock.calls).toHaveLength(1)

  const completeButton = screen.getByText('Set as done')
  await user.click(completeButton)
  expect(mockComplete.mock.calls).toHaveLength(1)
})