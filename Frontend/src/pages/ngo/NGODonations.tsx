import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Loader2 } from 'lucide-react';
import { ngoService } from '@/services/ngoService';
import { formatCurrency, formatDate } from '@/lib/utils';

const NGODonations = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: donations, isLoading, error } = useQuery({
    queryKey: ['ngo-donations'],
    queryFn: () => ngoService.getDonations(),
  });

  const filteredDonations = donations?.filter((donation: any) => {
    if (!searchQuery) return true;
    const donorName =
      typeof donation.donorId === 'object' ? donation.donorId.name : '';
    const donorEmail =
      typeof donation.donorId === 'object' ? donation.donorId.email : '';
    return (
      donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donorEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  // Calculate unique donors count
  const uniqueDonors = new Set(
    donations?.map((d: any) => {
      const donorId =
        typeof d.donorId === 'object' ? d.donorId._id : d.donorId;
      return donorId;
    }) || []
  ).size;

  // Calculate average donation
  const totalAmount = donations?.reduce(
    (sum: number, d: any) => sum + d.amount,
    0
  ) || 0;
  const averageDonation =
    donations && donations.length > 0
      ? totalAmount / donations.length
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
          <h1 className="text-3xl font-bold tracking-tight">Donor Management</h1>
          <p className="text-muted-foreground mt-2">View and manage your generous supporters</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{uniqueDonors}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {donations?.length || 0} donation{donations?.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {formatCurrency(totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All donations
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Donation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {formatCurrency(averageDonation)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Per contribution
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search donors by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Donations List */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>All Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDonations.length > 0 ? (
              <div className="space-y-3">
                {filteredDonations.map((donation: any, index: number) => {
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
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                            <span className="text-lg font-bold text-primary-foreground">
                              {donorName
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {donorName}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {donorEmail && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {donorEmail}
                                </div>
                              )}
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
                    Donations will appear here once received
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

export default NGODonations;
