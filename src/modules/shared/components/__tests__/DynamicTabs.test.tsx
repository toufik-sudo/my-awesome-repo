import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicTabs, DynamicTabItem } from '../DynamicTabs';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const basicTabs: DynamicTabItem[] = [
  { value: 'tab1', label: 'Tab One', content: <div>Content One</div> },
  { value: 'tab2', label: 'Tab Two', content: <div>Content Two</div> },
  { value: 'tab3', label: 'Tab Three', content: <div>Content Three</div> },
];

describe('DynamicTabs', () => {
  it('renders all visible tab triggers', () => {
    render(<DynamicTabs tabs={basicTabs} defaultValue="tab1" />);
    expect(screen.getByText('Tab One')).toBeInTheDocument();
    expect(screen.getByText('Tab Two')).toBeInTheDocument();
    expect(screen.getByText('Tab Three')).toBeInTheDocument();
  });

  it('renders default tab content', () => {
    render(<DynamicTabs tabs={basicTabs} defaultValue="tab1" />);
    expect(screen.getByText('Content One')).toBeInTheDocument();
  });

  it('calls onTabClick when tab is clicked', () => {
    const onClick = vi.fn();
    render(<DynamicTabs tabs={basicTabs} defaultValue="tab1" onTabClick={onClick} />);
    fireEvent.click(screen.getByText('Tab Two'));
    expect(onClick).toHaveBeenCalledWith('tab2');
  });

  it('calls onTabHover on mouse enter', () => {
    const onHover = vi.fn();
    render(<DynamicTabs tabs={basicTabs} defaultValue="tab1" onTabHover={onHover} />);
    fireEvent.mouseEnter(screen.getByText('Tab Two'));
    expect(onHover).toHaveBeenCalledWith('tab2');
  });

  it('hides tabs with hidden: true', () => {
    const tabs: DynamicTabItem[] = [
      ...basicTabs,
      { value: 'hidden', label: 'Hidden Tab', hidden: true, content: <div>Hidden</div> },
    ];
    render(<DynamicTabs tabs={tabs} defaultValue="tab1" />);
    expect(screen.queryByText('Hidden Tab')).not.toBeInTheDocument();
  });

  it('renders nothing when hidden prop is true', () => {
    const { container } = render(<DynamicTabs tabs={basicTabs} defaultValue="tab1" hidden />);
    expect(container.innerHTML).toBe('');
  });

  it('renders disabled tab', () => {
    const tabs: DynamicTabItem[] = [
      { value: 'a', label: 'Active', content: <div>A</div> },
      { value: 'b', label: 'Disabled', disabled: true, content: <div>B</div> },
    ];
    const onChange = vi.fn();
    render(<DynamicTabs tabs={tabs} defaultValue="a" onTabChange={onChange} />);
    fireEvent.click(screen.getByText('Disabled'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders badges on tabs', () => {
    const tabs: DynamicTabItem[] = [
      { value: 'a', label: 'Notifications', badge: 5, content: <div>N</div> },
    ];
    render(<DynamicTabs tabs={tabs} defaultValue="a" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with controlled value', () => {
    render(<DynamicTabs tabs={basicTabs} value="tab2" />);
    expect(screen.getByText('Content Two')).toBeInTheDocument();
  });

  it('renders tabListSuffix', () => {
    render(
      <DynamicTabs tabs={basicTabs} defaultValue="tab1" tabListSuffix={<span>Suffix</span>} />
    );
    expect(screen.getByText('Suffix')).toBeInTheDocument();
  });

  it('applies variant classes without crashing', () => {
    const variants = ['default', 'outline', 'pills', 'underline'] as const;
    variants.forEach(variant => {
      const { unmount } = render(
        <DynamicTabs tabs={basicTabs} defaultValue="tab1" variant={variant} />
      );
      expect(screen.getByText('Tab One')).toBeInTheDocument();
      unmount();
    });
  });

  it('applies size classes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { unmount } = render(
        <DynamicTabs tabs={basicTabs} defaultValue="tab1" size={size} />
      );
      expect(screen.getByText('Tab One')).toBeInTheDocument();
      unmount();
    });
  });
});
