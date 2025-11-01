import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Users, Heart, Target, Loader2 } from 'lucide-react';
import { donorService, Donation } from '@/services/donorService';
import { formatCurrency } from '@/lib/utils';

const ImpactReport = () => {
  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['donor-donations'],
    queryFn: () => donorService.getMyDonations(),
  });

  const { data: impactReports } = useQuery({
    queryKey: ['donor-impact-reports'],
    queryFn: () => donorService.getImpactReports(),
  });

  // Calculate stats from real donations
  const completedDonations =
    donations?.filter((d) => d.status === 'completed') || [];
  const totalDonated = completedDonations.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  // Calculate category distribution
  const categoryMap: Record<string, number> = {};
  completedDonations.forEach((donation) => {
    if (typeof donation.ngoId === 'object' && donation.ngoId.category) {
      const category = donation.ngoId.category || 'Other';
      categoryMap[category] = (categoryMap[category] || 0) + donation.amount;
    } else {
      categoryMap['Other'] = (categoryMap['Other'] || 0) + donation.amount;
    }
  });

  const sectorData = Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value,
      color:
        name === 'Education'
          ? 'hsl(168, 76%, 52%)'
          : name === 'Healthcare'
          ? 'hsl(340, 82%, 62%)'
          : name === 'Environment'
          ? 'hsl(142, 76%, 42%)'
          : name === 'Water'
          ? 'hsl(38, 92%, 50%)'
          : 'hsl(210, 20%, 70%)',
    }))
    .sort((a, b) => b.value - a.value);

  // Calculate monthly donation trend (last 6 months)
  const monthlyDataMap: Record<string, number> = {};
  completedDonations.forEach((donation) => {
    const date = new Date(donation.date);
    const monthKey = date.toLocaleString('default', { month: 'short' });
    monthlyDataMap[monthKey] = (monthlyDataMap[monthKey] || 0) + donation.amount;
  });

  const monthlyData = Object.entries(monthlyDataMap)
    .slice(-6)
    .map(([month, amount]) => ({ month, amount }));

  // Calculate impact metrics from reports
  const impactMetrics = [
    {
      label: 'Total Donated',
      value: formatCurrency(totalDonated),
      icon: Heart,
      color: 'text-primary',
    },
    {
      label: 'NGOs Supported',
      value: String(
        new Set(
          completedDonations.map((d) => {
            const ngoId = typeof d.ngoId === 'object' ? d.ngoId._id : d.ngoId;
            return ngoId;
          })
        ).size
      ),
      icon: Users,
      color: 'text-accent',
    },
    {
      label: 'Donations Made',
      value: String(completedDonations.length),
      icon: Target,
      color: 'text-success',
    },
    {
      label: 'Impact Reports',
      value: String(impactReports?.length || 0),
      icon: TrendingUp,
      color: 'text-warning',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="p-6">
            <CardContent className="text-center">
              <p className="text-destructive">Failed to load impact data</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impact Report</h1>
          <p className="text-muted-foreground mt-2">See the real-world impact of your donations</p>
        </div>

        {/* Impact Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {impactMetrics.map((metric, index) => (
            <Card 
              key={metric.label}
              className="border-border/50 shadow-lg card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${metric.color}`}>{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">Lives impacted</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sector Distribution */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Donation Distribution by Sector</CardTitle>
              <CardDescription>Where your money is making a difference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {sectorData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full shadow-glow"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name} ({formatCurrency(item.value)})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Donation Trend</CardTitle>
              <CardDescription>Your giving over the last 5 months</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyData.length > 0 ? (
                <>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis
                          dataKey="month"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => formatCurrency(value)}
                        />
                        <Bar
                          dataKey="amount"
                          fill="hsl(var(--primary))"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {monthlyData.length >= 2 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span>
                        {monthlyData[monthlyData.length - 1].amount >
                        monthlyData[monthlyData.length - 2].amount
                          ? '+'
                          : ''}
                        {Math.round(
                          ((monthlyData[monthlyData.length - 1].amount -
                            monthlyData[monthlyData.length - 2].amount) /
                            monthlyData[monthlyData.length - 2].amount) *
                            100
                        )}
                        % from last month
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No donation data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Utilization Report - Using Impact Reports if available */}
        {impactReports && impactReports.length > 0 && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Impact Reports</CardTitle>
              <CardDescription>
                Reports from NGOs showing how your donations were used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {impactReports.slice(0, 5).map((report, index) => {
                  const ngoName =
                    typeof report.ngoId === 'object' ? report.ngoId.name : 'NGO';
                  return (
                    <div
                      key={report._id}
                      className="space-y-2 animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s}` }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{report.title}</span>
                        <span className="text-muted-foreground">{ngoName}</span>
                      </div>
                      {report.summary && (
                        <p className="text-sm text-muted-foreground">
                          {report.summary}
                        </p>
                      )}
                      {report.year && (
                        <span className="text-xs text-muted-foreground">
                          Year: {report.year}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ImpactReport;
