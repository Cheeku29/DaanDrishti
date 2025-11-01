import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Building2, DollarSign, Loader2 } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { donorService, Donation } from '@/services/donorService';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const DonorDashboard = () => {
  const navigate = useNavigate();

  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['donor-donations'],
    queryFn: () => donorService.getMyDonations(),
  });

  // Calculate stats from real data
  const completedDonations = donations?.filter(d => d.status === 'completed') || [];
  const totalDonated = completedDonations.reduce((sum, d) => sum + d.amount, 0);
  const uniqueNGOs = new Set(completedDonations.map(d => {
    const ngoId = typeof d.ngoId === 'object' ? d.ngoId._id : d.ngoId;
    return ngoId;
  })).size;

  // Get recent donations (last 5)
  const recentDonations = completedDonations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({
      name,
      value: Math.round((value / totalDonated) * 100),
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
    const errorMessage = (error as Error).message || 'Unknown error';
    const isAuthError = errorMessage.toLowerCase().includes('token') || 
                       errorMessage.toLowerCase().includes('unauthorized') ||
                       errorMessage.toLowerCase().includes('session expired');
    
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="p-6 max-w-md">
            <CardContent className="text-center space-y-4">
              <p className="text-destructive font-semibold">
                {isAuthError ? 'Authentication Error' : 'Failed to load dashboard data'}
              </p>
              <p className="text-sm text-muted-foreground">
                {errorMessage}
              </p>
              {isAuthError && (
                <Button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                  className="mt-4"
                >
                  Go to Login
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your donations and see your impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalDonated)}</div>
              <p className="text-xs text-muted-foreground">
                {completedDonations.length} donation{completedDonations.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">NGOs Supported</CardTitle>
              <Building2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueNGOs}</div>
              <p className="text-xs text-muted-foreground">
                {categoryData.length} categor{categoryData.length !== 1 ? 'ies' : 'y'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Donations</CardTitle>
              <Heart className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedDonations.length}</div>
              <p className="text-xs text-muted-foreground">Completed donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Donation</CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedDonations.length > 0
                  ? formatCurrency(totalDonated / completedDonations.length)
                  : formatCurrency(0)}
              </div>
              <p className="text-xs text-muted-foreground">Per donation</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Distribution</CardTitle>
              <CardDescription>See where your donations are making a difference</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
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
                    {categoryData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: chartColors[index % chartColors.length],
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <p>No donation data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest contributions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentDonations.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {recentDonations.map((donation) => {
                      const ngoName =
                        typeof donation.ngoId === 'object'
                          ? donation.ngoId.name
                          : 'Unknown NGO';
                      return (
                        <div
                          key={donation._id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium">{ngoName}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(donation.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              {formatCurrency(donation.amount)}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                              {donation.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    className="w-full mt-4 bg-gradient-accent hover:opacity-90"
                    onClick={() => navigate('/ngos')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Make a Donation
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No donations yet</p>
                    <p className="text-sm mt-2">Start making a difference today!</p>
                  </div>
                  <Button
                    className="w-full bg-gradient-accent hover:opacity-90"
                    onClick={() => navigate('/ngos')}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Make a Donation
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

export default DonorDashboard;
