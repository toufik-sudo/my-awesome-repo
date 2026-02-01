// -----------------------------------------------------------------------------
// Point Conversion Page
// Migrated from old_app/src/components/pages/wall/PointConversionPage.tsx
// Admin page for viewing point conversion statistics and history
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LabelList 
} from 'recharts';
import { Download, TrendingUp, Users, CreditCard, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { WALL_ROUTE } from '@/constants/routes';

interface ConversionStats {
  totalAmount: number;
  totalUsers: number;
  totalTransactions: number;
  balance: number;
}

interface ProgramData {
  programName: string;
  programAmount: number;
}

interface PlatformData {
  platformName: string;
  platformAmount: number;
}

const PointConversionPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<ConversionStats>({
    totalAmount: 15420,
    totalUsers: 156,
    totalTransactions: 423,
    balance: 50000,
  });

  const [programData] = useState<ProgramData[]>([
    { programName: 'Sales Rewards', programAmount: 5200 },
    { programName: 'Employee Recognition', programAmount: 4800 },
    { programName: 'Customer Loyalty', programAmount: 3200 },
    { programName: 'Partner Incentives', programAmount: 2220 },
  ]);

  const [platformData] = useState<PlatformData[]>([
    { platformName: 'Platform A', platformAmount: 8500 },
    { platformName: 'Platform B', platformAmount: 4200 },
    { platformName: 'Platform C', platformAmount: 2720 },
  ]);

  const [conversions] = useState([
    { id: 1, user: 'John Doe', program: 'Sales Rewards', amount: 150, date: '2026-01-25', status: 'completed' },
    { id: 2, user: 'Jane Smith', program: 'Employee Recognition', amount: 75, date: '2026-01-24', status: 'completed' },
    { id: 3, user: 'Bob Wilson', program: 'Customer Loyalty', amount: 200, date: '2026-01-24', status: 'pending' },
    { id: 4, user: 'Alice Brown', program: 'Partner Incentives', amount: 100, date: '2026-01-23', status: 'completed' },
  ]);

  const handleExport = () => {
    // TODO: Implement Excel export
    console.log('Exporting to Excel...');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{payload[0].payload.programName || payload[0].payload.platformName}</p>
          <p className="text-primary font-bold">
            €{(payload[0].value as number).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            {formatMessage({ id: 'pointConversion.title', defaultMessage: 'Point Conversions' })}
          </h1>
          <p className="text-muted-foreground">
            {formatMessage({ id: 'pointConversion.subtitle', defaultMessage: 'View and manage point conversion history' })}
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          {formatMessage({ id: 'pointConversion.export', defaultMessage: 'Export Excel' })}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {formatMessage({ id: 'pointConversion.balance', defaultMessage: 'Hurray Balance' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.balance.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {formatMessage({ id: 'pointConversion.totalConverted', defaultMessage: 'Total Converted' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">€{stats.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {formatMessage({ id: 'pointConversion.transactions', defaultMessage: 'Transactions' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              {formatMessage({ id: 'pointConversion.users', defaultMessage: 'Users' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            {formatMessage({ id: 'pointConversion.history', defaultMessage: 'History' })}
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {formatMessage({ id: 'pointConversion.charts', defaultMessage: 'Charts' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>
                {formatMessage({ id: 'pointConversion.conversionHistory', defaultMessage: 'Conversion History' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        {formatMessage({ id: 'table.user', defaultMessage: 'User' })}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {formatMessage({ id: 'table.program', defaultMessage: 'Program' })}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {formatMessage({ id: 'table.amount', defaultMessage: 'Amount' })}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {formatMessage({ id: 'table.date', defaultMessage: 'Date' })}
                      </th>
                      <th className="text-left py-3 px-4 font-medium">
                        {formatMessage({ id: 'table.status', defaultMessage: 'Status' })}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversions.map((conversion) => (
                      <tr key={conversion.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{conversion.user}</td>
                        <td className="py-3 px-4">{conversion.program}</td>
                        <td className="py-3 px-4 font-medium">€{conversion.amount}</td>
                        <td className="py-3 px-4 text-muted-foreground">{conversion.date}</td>
                        <td className="py-3 px-4">
                          <Badge variant={conversion.status === 'completed' ? 'default' : 'secondary'}>
                            {conversion.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Program Chart */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {formatMessage({ id: 'pointConversion.byProgram', defaultMessage: 'By Program' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={programData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="programName" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="programAmount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="programAmount" position="top" fontSize={12} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Chart */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {formatMessage({ id: 'pointConversion.byPlatform', defaultMessage: 'By Platform' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="platformName" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="platformAmount" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="platformAmount" position="top" fontSize={12} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PointConversionPage;
