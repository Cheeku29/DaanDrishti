import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, Loader2 } from 'lucide-react';
import { donorService, Donation } from '@/services/donorService';
import { formatCurrency, formatDate } from '@/lib/utils';

const MyDonations = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['donor-donations'],
    queryFn: () => donorService.getMyDonations(),
  });

  const filteredDonations = donations?.filter((donation) => {
    if (!searchQuery) return true;
    const ngoName =
      typeof donation.ngoId === 'object' ? donation.ngoId.name : '';
    return ngoName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

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
              <p className="text-destructive">Failed to load donations</p>
              <p className="text-sm text-muted-foreground mt-2">
                {(error as Error).message}
              </p>
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
          <h1 className="text-3xl font-bold tracking-tight">My Donations</h1>
          <p className="text-muted-foreground mt-2">Track all your charitable contributions</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by NGO name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Donations Table */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDonations.length > 0 ? (
              <div className="space-y-3">
                {filteredDonations.map((donation, index) => {
                  const ngoName =
                    typeof donation.ngoId === 'object'
                      ? donation.ngoId.name
                      : 'Unknown NGO';
                  const category =
                    typeof donation.ngoId === 'object'
                      ? donation.ngoId.category || 'Other'
                      : 'Other';
                  return (
                    <div
                      key={donation._id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-1 space-y-2 md:space-y-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                            <span className="text-sm font-bold text-primary-foreground">
                              {ngoName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {ngoName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(donation.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {formatCurrency(donation.amount)}
                          </p>
                          {donation.orderId && (
                            <p className="text-xs text-muted-foreground">
                              Order: {donation.orderId.slice(-8)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              donation.status === 'completed'
                                ? 'default'
                                : donation.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                            }
                            className={
                              donation.status === 'completed'
                                ? 'bg-success/20 text-success border-success/30'
                                : ''
                            }
                          >
                            {donation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>
                  {searchQuery
                    ? 'No donations found matching your search'
                    : 'No donations yet'}
                </p>
                {!searchQuery && (
                  <p className="text-sm mt-2">
                    Start making a difference by donating to NGOs!
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyDonations;
