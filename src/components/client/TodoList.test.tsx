import { render, screen, fireEvent } from '@testing-library/react';
import { TodoList } from '@/components/client/TodoList';

// Mock localStorage for component tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock empty localStorage for each test
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should render the todo app title', () => {
    render(<TodoList />);
    expect(screen.getByText('Todo App')).toBeInTheDocument();
  });

  it('should add new todo when form is submitted', () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(button);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('should show empty state when no todos exist', () => {
    render(<TodoList />);
    expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
  });

  it('should clear input after adding todo', () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(button);

    expect(input).toHaveValue('');
  });

  it('should show drag handle on todo items', () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(button);

    // Check if drag handle (svg icon) is present
    const dragHandle = document.querySelector('svg');
    expect(dragHandle).toBeInTheDocument();
  });
});