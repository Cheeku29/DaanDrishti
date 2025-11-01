import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { ngoService } from '@/services/ngoService';
import { formatCurrency, formatDate } from '@/lib/utils';

const NGODashboard = () => {
  const navigate = useNavigate();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['ngo-dashboard'],
    queryFn: () => ngoService.getDashboard(),
  });

  const { data: spendingData } = useQuery({
    queryKey: ['ngo-spending'],
    queryFn: () => ngoService.getSpending(),
  });

  // Calculate spending distribution by category
  const categoryMap: Record<string, number> = {};
  spendingData?.forEach((spending) => {
    categoryMap[spending.category] =
      (categoryMap[spending.category] || 0) + spending.amount;
  });

  const spendingChartData = Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value: Math.round(
        (value / (dashboardData?.stats.totalSpent || 1)) * 100
      ),
      amount: value,
    }))
    .sort((a, b) => b.value - a.value);

  const chartColors = [
    'hsl(180, 65%, 42%)',
    'hsl(15, 85%, 62%)',
    'hsl(142, 70%, 45%)',
    'hsl(38, 92%, 50%)',
    'hsl(210, 20%, 70%)',
    'hsl(280, 65%, 55%)',
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
              <p className="text-destructive">Failed to load dashboard</p>
              <p className="text-sm text-muted-foreground mt-2">
                {(error as Error).message}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const stats = dashboardData?.stats || {
    totalReceived: 0,
    totalSpent: 0,
    available: 0,
    donationCount: 0,
    spendingCount: 0,
  };
  const recentDonations = dashboardData?.recentDonations || [];
  const ngo = dashboardData?.ngo;
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {ngo?.name || 'NGO Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your organization and track donations
            </p>
          </div>
          <div className="flex items-center gap-2">
            {ngo?.verified ? (
              <>
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-success">
                  Verified NGO
                </span>
              </>
            ) : (
              <Badge variant="secondary">Pending Verification</Badge>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalReceived)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.donationCount} donation{stats.donationCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(
                  recentDonations.map((d: any) =>
                    typeof d.donorId === 'object'
                      ? d.donorId._id
                      : d.donorId
                  )
                ).size}
              </div>
              <p className="text-xs text-muted-foreground">Total contributors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Funds Utilized</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalReceived > 0
                  ? Math.round((stats.totalSpent / stats.totalReceived) * 100)
                  : 0}
                % of total funds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.available)}
              </div>
              <p className="text-xs text-muted-foreground">Ready to deploy</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Distribution</CardTitle>
              <CardDescription>How funds are being utilized</CardDescription>
            </CardHeader>
            <CardContent>
              {spendingChartData.length > 0 ? (
                <>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={spendingChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {spendingChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={chartColors[index % chartColors.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {spendingChartData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              chartColors[index % chartColors.length],
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => navigate('/ngo/spending')}
                  >
                    Add Spending Record
                  </Button>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                  <p>No spending data available</p>
                  <p className="text-sm mt-2">Start tracking your spending!</p>
                  <Button
                    className="mt-4"
                    variant="outline"
                    onClick={() => navigate('/ngo/spending')}
                  >
                    Add First Spending Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Donors */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donors</CardTitle>
              <CardDescription>Latest contributions received</CardDescription>
            </CardHeader>
            <CardContent>
              {recentDonations.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {recentDonations.map((donation: any) => {
                      const donorName =
                        typeof donation.donorId === 'object'
                          ? donation.donorId.name
                          : 'Anonymous';
                      const donorEmail =
                        typeof donation.donorId === 'object'
                          ? donation.donorId.email
                          : '';
                      return (
                        <div
                          key={donation._id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{donorName}</p>
                            {donorEmail && (
                              <p className="text-xs text-muted-foreground">
                                {donorEmail}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {formatDate(donation.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              {formatCurrency(donation.amount)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    className="w-full mt-4"
                    variant="outline"
                    onClick={() => navigate('/ngo/donations')}
                  >
                    View All Donations
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No donations yet</p>
                    <p className="text-sm mt-2">
                      Donations will appear here once received
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate('/ngo/donations')}
                  >
                    View Donations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NGODashboard;
