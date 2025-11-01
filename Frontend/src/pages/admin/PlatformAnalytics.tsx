import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, Building2, DollarSign, Activity, Loader2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { formatCurrency } from '@/lib/utils';

const PlatformAnalytics = () => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => adminService.getAnalytics(),
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
  });

  const chartColors = [
    'hsl(180, 65%, 42%)',
    'hsl(15, 85%, 62%)',
    'hsl(142, 70%, 45%)',
    'hsl(38, 92%, 50%)',
    'hsl(210, 20%, 70%)',
    'hsl(280, 65%, 55%)',
  ];

  // Prepare pie chart data
  const ngoVsSocialEventsData = analytics?.charts?.ngoVsSocialEvents
    ? [
        { name: 'NGOs', value: analytics.charts.ngoVsSocialEvents.ngo },
        {
          name: 'Social Events',
          value: analytics.charts.ngoVsSocialEvents.socialEvents,
        },
      ]
    : [];

  const ngoVsDonorsData = analytics?.charts?.ngoVsDonors
    ? [
        { name: 'NGOs', value: analytics.charts.ngoVsDonors.ngo },
        { name: 'Donors', value: analytics.charts.ngoVsDonors.donors },
      ]
    : [];

  const stats = dashboardData?.stats || {
    totalNGOs: 0,
    verifiedNGOs: 0,
    pendingNGOs: 0,
    totalDonors: 0,
    totalDonations: 0,
    totalAmount: 0,
    totalSocialEvents: 0,
  };

  const avgDonation =
    stats.totalDonations > 0
      ? stats.totalAmount / stats.totalDonations
      : 0;

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
              <p className="text-destructive">Failed to load analytics</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-muted-foreground mt-2">Comprehensive insights and trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(stats.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalDonations} donation{stats.totalDonations !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Active NGOs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {stats.verifiedNGOs}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingNGOs} pending
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {stats.totalDonors}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active contributors
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Avg. Donation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {formatCurrency(avgDonation)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per donation</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Social Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {stats.totalSocialEvents}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total events</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>NGOs vs Social Events</CardTitle>
              <CardDescription>Distribution comparison</CardDescription>
            </CardHeader>
            <CardContent>
              {ngoVsSocialEventsData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ngoVsSocialEventsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ngoVsSocialEventsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>NGOs vs Donors</CardTitle>
              <CardDescription>Platform user distribution</CardDescription>
            </CardHeader>
            <CardContent>
              {ngoVsDonorsData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ngoVsDonorsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {ngoVsDonorsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top NGOs */}
        {analytics?.topNGOs && analytics.topNGOs.length > 0 && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Top Performing NGOs</CardTitle>
              <CardDescription>NGOs with highest donation amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topNGOs.slice(0, 10).map((item: any, index: number) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {item.ngo?.name || 'Unknown NGO'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.donationCount} donation
                          {item.donationCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(item.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PlatformAnalytics;
