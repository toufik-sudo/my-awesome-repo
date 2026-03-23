import React, { memo } from 'react';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { DynamicCharts as DynamicChart, ChartSeries } from '@/modules/shared/components/DynamicCharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const monthlyData = [
  { month: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
  { month: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
  { month: 'Mar', revenue: 5000, expenses: 3800, profit: 1200 },
  { month: 'Apr', revenue: 4780, expenses: 3908, profit: 872 },
  { month: 'May', revenue: 5890, expenses: 4800, profit: 1090 },
  { month: 'Jun', revenue: 6390, expenses: 3800, profit: 2590 },
  { month: 'Jul', revenue: 7490, expenses: 4300, profit: 3190 },
];

const pieData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 200 },
  { name: 'Other', value: 100 },
];

const radarData = [
  { subject: 'Speed', A: 120, B: 110 },
  { subject: 'Reliability', A: 98, B: 130 },
  { subject: 'Design', A: 86, B: 130 },
  { subject: 'Features', A: 99, B: 100 },
  { subject: 'Support', A: 85, B: 90 },
  { subject: 'Price', A: 65, B: 85 },
];

const lineSeries: ChartSeries[] = [
  { dataKey: 'revenue', name: 'Revenue', color: 'hsl(var(--primary))', strokeWidth: 2 },
  { dataKey: 'expenses', name: 'Expenses', color: 'hsl(var(--destructive))', strokeWidth: 2, type: 'monotone' },
];

const barSeries: ChartSeries[] = [
  { dataKey: 'revenue', name: 'Revenue', color: 'hsl(var(--primary))' },
  { dataKey: 'expenses', name: 'Expenses', color: 'hsl(var(--muted-foreground))' },
];

const areaSeries: ChartSeries[] = [
  { dataKey: 'revenue', name: 'Revenue', color: 'hsl(var(--primary))', fillOpacity: 0.3 },
  { dataKey: 'profit', name: 'Profit', color: 'hsl(var(--accent-foreground))', fillOpacity: 0.2 },
];

const pieSeries: ChartSeries[] = [{ dataKey: 'value', name: 'Traffic' }];

const radarSeries: ChartSeries[] = [
  { dataKey: 'A', name: 'Product A', color: 'hsl(var(--primary))' },
  { dataKey: 'B', name: 'Product B', color: 'hsl(var(--destructive))' },
];

const stackedSeries: ChartSeries[] = [
  { dataKey: 'revenue', name: 'Revenue', color: 'hsl(var(--primary))', stackId: 'a' },
  { dataKey: 'expenses', name: 'Expenses', color: 'hsl(var(--muted-foreground))', stackId: 'a' },
];

export const ChartsDemo = memo(() => (
  <ErrorBoundary>
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">DynamicCharts Demo</h1>
        <p className="text-muted-foreground mt-1">All chart types with sample data and prop variations</p>
      </div>

      {/* Line Chart */}
      <DynamicChart
        type="line"
        data={monthlyData}
        series={lineSeries}
        xAxisKey="month"
        title="Line Chart"
        description="Monthly revenue vs expenses"
        chartHeight={300}
      />

      {/* Bar Chart */}
      <DynamicChart
        type="bar"
        data={monthlyData}
        series={barSeries}
        xAxisKey="month"
        title="Bar Chart"
        description="Side-by-side comparison"
        chartHeight={300}
      />

      {/* Area Chart */}
      <DynamicChart
        type="area"
        data={monthlyData}
        series={areaSeries}
        xAxisKey="month"
        title="Area Chart"
        description="Revenue and profit trends with fill"
        chartHeight={300}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <DynamicChart
          type="pie"
          data={pieData}
          series={pieSeries}
          title="Pie Chart"
          description="Traffic source distribution"
          chartHeight={300}
          colors={['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--accent-foreground))', 'hsl(var(--muted-foreground))']}
        />

        {/* Donut Chart */}
        <DynamicChart
          type="pie"
          data={pieData}
          series={pieSeries}
          title="Donut Chart"
          description="Pie with innerRadius for donut effect"
          chartHeight={300}
          innerRadius={60}
          colors={['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--accent-foreground))', 'hsl(var(--muted-foreground))']}
        />
      </div>

      {/* Radar Chart */}
      <DynamicChart
        type="radar"
        data={radarData}
        series={radarSeries}
        xAxisKey="subject"
        title="Radar Chart"
        description="Multi-axis comparison of two products"
        chartHeight={350}
      />

      {/* Stacked Bar */}
      <DynamicChart
        type="stacked-bar"
        data={monthlyData}
        series={stackedSeries}
        xAxisKey="month"
        title="Stacked Bar Chart"
        description="Revenue and expenses stacked"
        chartHeight={300}
      />

      {/* Minimal - no grid, legend, axes */}
      <Card>
        <CardHeader><CardTitle>Minimal Chart</CardTitle><CardDescription>Grid, axes, and legend hidden</CardDescription></CardHeader>
        <CardContent>
          <DynamicChart
            type="line"
            data={monthlyData}
            series={[{ dataKey: 'profit', name: 'Profit', color: 'hsl(var(--primary))', strokeWidth: 3 }]}
            xAxisKey="month"
            chartHeight={200}
            showGrid={false}
            showXAxis={false}
            showYAxis={false}
            showLegend={false}
          />
        </CardContent>
      </Card>

      {/* Loading state */}
      <DynamicChart
        type="bar"
        data={[]}
        series={barSeries}
        title="Loading State"
        description="Chart with loading indicator"
        loading
        chartHeight={250}
      />

      {/* Empty state */}
      <DynamicChart
        type="bar"
        data={[]}
        series={barSeries}
        title="Empty State"
        description="Chart with no data"
        emptyMessage="No data available for this period"
        chartHeight={250}
      />
    </div>
  </ErrorBoundary>
));

ChartsDemo.displayName = 'ChartsDemo';
