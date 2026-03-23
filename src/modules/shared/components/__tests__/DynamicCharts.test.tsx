import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DynamicCharts, ChartSeries } from '../DynamicCharts';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock recharts ResponsiveContainer since jsdom has no layout
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: 500, height: 350 }}>{children}</div>
    ),
  };
});

const sampleData = [
  { name: 'Jan', value: 100, revenue: 200 },
  { name: 'Feb', value: 200, revenue: 300 },
  { name: 'Mar', value: 150, revenue: 250 },
];

const sampleSeries: ChartSeries[] = [
  { dataKey: 'value', name: 'Value' },
  { dataKey: 'revenue', name: 'Revenue' },
];

describe('DynamicCharts', () => {
  it('renders loading state', () => {
    render(<DynamicCharts data={[]} type="line" series={sampleSeries} loading />);
    expect(screen.getByText('charts.loading')).toBeInTheDocument();
  });

  it('renders empty state with default message', () => {
    render(<DynamicCharts data={[]} type="line" series={sampleSeries} />);
    expect(screen.getByText('charts.noData')).toBeInTheDocument();
  });

  it('renders empty state with custom message', () => {
    render(<DynamicCharts data={[]} type="line" series={sampleSeries} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(
      <DynamicCharts data={sampleData} type="line" series={sampleSeries} hidden />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders title and description in card', () => {
    render(
      <DynamicCharts data={sampleData} type="bar" series={sampleSeries} title="My Chart" description="A description" />
    );
    expect(screen.getByText('My Chart')).toBeInTheDocument();
    expect(screen.getByText('A description')).toBeInTheDocument();
  });

  it('renders without card wrapper', () => {
    const { container } = render(
      <DynamicCharts data={sampleData} type="bar" series={sampleSeries} withCard={false} />
    );
    expect(container.querySelector('[class*="card"]')).toBeNull();
  });

  it('renders line chart', () => {
    render(<DynamicCharts data={sampleData} type="line" series={sampleSeries} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders bar chart', () => {
    render(<DynamicCharts data={sampleData} type="bar" series={sampleSeries} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders area chart', () => {
    render(<DynamicCharts data={sampleData} type="area" series={sampleSeries} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders pie chart', () => {
    const pieData = [{ name: 'A', value: 40 }, { name: 'B', value: 30 }];
    render(<DynamicCharts data={pieData} type="pie" series={[{ dataKey: 'value' }]} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders radar chart', () => {
    render(<DynamicCharts data={sampleData} type="radar" series={sampleSeries} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders stacked-bar chart', () => {
    render(<DynamicCharts data={sampleData} type="stacked-bar" series={sampleSeries} />);
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });
});
