import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial value on first render', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should load saved value from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify('saved-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    // Wait for useEffect to run (hydration)
    expect(localStorageMock.getItem).toHaveBeenCalledWith('test-key');
    expect(result.current[0]).toBe('saved-value');
  });

  it('should save value to localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    );
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'localStorage error for key "test-key":',
      expect.any(Error)
    );

    consoleWarnSpy.mockRestore();
  });
});