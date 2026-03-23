import React, { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseComponentProps } from '@/types/component.types';
import { buildComponentStyles } from '@/utils/styleBuilder';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface ChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
  type?: 'monotone' | 'linear' | 'step';
  strokeWidth?: number;
  fillOpacity?: number;
  stackId?: string;
}

export interface DynamicChartProps extends Omit<BaseComponentProps, 'height'> {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'area' | 'pie' | 'radar' | 'stacked-bar';
  series: ChartSeries[];
  xAxisKey?: string;
  title?: string;
  description?: string;
  chartHeight?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  animate?: boolean;
  colors?: string[];
  loading?: boolean;
  emptyMessage?: string;
  /** Pie chart inner radius for donut */
  innerRadius?: number;
  outerRadius?: number;
  /** Label key for pie chart */
  labelKey?: string;
  /** Value key for pie chart */
  valueKey?: string;
  /** Callbacks */
  onDataPointClick?: (data: ChartDataPoint, index: number) => void;
  onLegendClick?: (dataKey: string) => void;
  /** Custom tooltip */
  customTooltip?: React.FC<any>;
  /** Card wrapper */
  withCard?: boolean;
  cardClassName?: string;
}

// ─── Default Colors ──────────────────────────────────────────────────────────

const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--destructive))',
  'hsl(215, 70%, 60%)',
  'hsl(160, 60%, 50%)',
  'hsl(25, 80%, 55%)',
  'hsl(280, 70%, 60%)',
];

// ─── Component ───────────────────────────────────────────────────────────────

export const DynamicCharts: React.FC<DynamicChartProps> = memo(({
  data,
  type,
  series,
  xAxisKey = 'name',
  title,
  description,
  chartHeight: height = 350,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  animate = true,
  colors = DEFAULT_COLORS,
  loading = false,
  emptyMessage,
  innerRadius,
  outerRadius = 80,
  labelKey = 'name',
  valueKey = 'value',
  onDataPointClick,
  onLegendClick,
  customTooltip,
  withCard = true,
  cardClassName,
  ...baseProps
}) => {
  const { t } = useTranslation();
  const { style, className } = buildComponentStyles(baseProps);

  const getColor = useCallback((index: number) => colors[index % colors.length], [colors]);

  const handleClick = useCallback((data: any, index: number) => {
    onDataPointClick?.(data, index);
  }, [onDataPointClick]);

  if (baseProps.hidden) return null;

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ ...style, height }}>
        <p className="text-muted-foreground animate-pulse">{t('charts.loading')}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ ...style, height }}>
        <p className="text-muted-foreground">{emptyMessage || t('charts.noData')}</p>
      </div>
    );
  }

  const commonAxisProps = {
    tick: { fontSize: 12, fill: 'hsl(var(--muted-foreground))' },
    axisLine: { stroke: 'hsl(var(--border))' },
    tickLine: false,
  };

  const tooltipProps = showTooltip ? {
    content: customTooltip,
    contentStyle: {
      backgroundColor: 'hsl(var(--popover))',
      borderColor: 'hsl(var(--border))',
      borderRadius: 'var(--radius)',
      color: 'hsl(var(--popover-foreground))',
    },
  } : undefined;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} onClick={(e) => e?.activePayload && handleClick(e.activePayload[0]?.payload, e.activeTooltipIndex || 0)}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            {showXAxis && <XAxis dataKey={xAxisKey} {...commonAxisProps} />}
            {showYAxis && <YAxis {...commonAxisProps} />}
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
            {series.map((s, i) => (
              <Line
                key={s.dataKey}
                type={s.type || 'monotone'}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color || getColor(i)}
                strokeWidth={s.strokeWidth || 2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={animate ? 1000 : 0}
              />
            ))}
          </LineChart>
        );

      case 'bar':
      case 'stacked-bar':
        return (
          <BarChart data={data} onClick={(e) => e?.activePayload && handleClick(e.activePayload[0]?.payload, e.activeTooltipIndex || 0)}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            {showXAxis && <XAxis dataKey={xAxisKey} {...commonAxisProps} />}
            {showYAxis && <YAxis {...commonAxisProps} />}
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
            {series.map((s, i) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                fill={s.color || getColor(i)}
                stackId={type === 'stacked-bar' ? (s.stackId || 'stack') : undefined}
                radius={[4, 4, 0, 0]}
                animationDuration={animate ? 1000 : 0}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart data={data} onClick={(e) => e?.activePayload && handleClick(e.activePayload[0]?.payload, e.activeTooltipIndex || 0)}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            {showXAxis && <XAxis dataKey={xAxisKey} {...commonAxisProps} />}
            {showYAxis && <YAxis {...commonAxisProps} />}
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
            {series.map((s, i) => (
              <Area
                key={s.dataKey}
                type={s.type || 'monotone'}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color || getColor(i)}
                fill={s.color || getColor(i)}
                fillOpacity={s.fillOpacity ?? 0.15}
                strokeWidth={s.strokeWidth || 2}
                animationDuration={animate ? 1000 : 0}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={labelKey}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              label
              animationDuration={animate ? 1000 : 0}
              onClick={(_, index) => handleClick(data[index], index)}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index)} />
              ))}
            </Pie>
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'radar':
        return (
          <RadarChart data={data} cx="50%" cy="50%" outerRadius={outerRadius}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <PolarRadiusAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            {series.map((s, i) => (
              <Radar
                key={s.dataKey}
                name={s.name || s.dataKey}
                dataKey={s.dataKey}
                stroke={s.color || getColor(i)}
                fill={s.color || getColor(i)}
                fillOpacity={s.fillOpacity ?? 0.2}
                animationDuration={animate ? 1000 : 0}
              />
            ))}
            {showTooltip && <Tooltip {...tooltipProps} />}
            {showLegend && <Legend />}
          </RadarChart>
        );

      default:
        return null;
    }
  };

  const chartContent = (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart() as any}
    </ResponsiveContainer>
  );

  if (!withCard) {
    return <div className={className} style={style}>{chartContent}</div>;
  }

  return (
    <Card className={cn(cardClassName, className)} style={style}>
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="pt-0">{chartContent}</CardContent>
    </Card>
  );
});

DynamicCharts.displayName = 'DynamicCharts';
