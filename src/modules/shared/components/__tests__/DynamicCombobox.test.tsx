import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicCombobox, ComboboxOption } from '../DynamicCombobox';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const options: ComboboxOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', description: 'A red fruit' },
  { label: 'Disabled', value: 'disabled', disabled: true },
];

describe('DynamicCombobox', () => {
  it('renders with placeholder', () => {
    render(<DynamicCombobox options={options} placeholder="Pick a fruit" />);
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(<DynamicCombobox options={options} hidden />);
    expect(container.innerHTML).toBe('');
  });

  it('shows selected single value', () => {
    render(<DynamicCombobox options={options} value="apple" />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('shows multi-select badges', () => {
    render(<DynamicCombobox options={options} value={['apple', 'banana']} multiSelect />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('shows +N badge when more than 3 selected', () => {
    const manyOptions: ComboboxOption[] = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
      { label: 'C', value: 'c' },
      { label: 'D', value: 'd' },
    ];
    render(<DynamicCombobox options={manyOptions} value={['a', 'b', 'c', 'd']} multiSelect />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('renders with disabled state', () => {
    render(<DynamicCombobox options={options} disabled placeholder="Select" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onOpenChange when opened', () => {
    const onOpenChange = vi.fn();
    render(<DynamicCombobox options={options} onOpenChange={onOpenChange} placeholder="Select" />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders custom renderValue', () => {
    render(
      <DynamicCombobox
        options={options}
        value="apple"
        renderValue={() => <span>Custom Display</span>}
      />
    );
    expect(screen.getByText('Custom Display')).toBeInTheDocument();
  });

  it('renders default placeholder when no value', () => {
    render(<DynamicCombobox options={options} />);
    expect(screen.getByText('combobox.select')).toBeInTheDocument();
  });

  it('applies size classes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { unmount } = render(
        <DynamicCombobox options={options} size={size} placeholder="Select" />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      unmount();
    });
  });
});
