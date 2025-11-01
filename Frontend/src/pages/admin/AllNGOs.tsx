import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Search, Eye, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const AllNGOs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'pending'>('all');

  const { data: ngos, isLoading, error } = useQuery({
    queryKey: ['admin-all-ngos'],
    queryFn: () => adminService.getAllNGOs(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      adminService.verifyNGO(id, verified),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-ngos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['admin-pending-ngos'] });
      queryClient.invalidateQueries({ queryKey: ['publicNGOs'] });
      toast({
        title: variables.verified ? 'NGO Verified' : 'NGO Unverified',
        description: `NGO ${variables.verified ? 'verified' : 'unverified'} successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Note: We need to calculate donors and raised amounts from donations
  // For now, we'll show basic info
  const filteredNGOs = ngos?.filter((ngo: any) => {
    if (searchQuery) {
      const matchesSearch =
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.state?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
    }
    if (filterVerified === 'verified') return ngo.verified === true;
    if (filterVerified === 'pending') return ngo.verified === false;
    return true;
  }) || [];

  const verifiedCount = ngos?.filter((n: any) => n.verified).length || 0;
  const pendingCount = ngos?.filter((n: any) => !n.verified).length || 0;

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
              <p className="text-destructive">Failed to load NGOs</p>
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
          <h1 className="text-3xl font-bold tracking-tight">All NGOs</h1>
          <p className="text-muted-foreground mt-2">Manage all registered organizations</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50 shadow-lg card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {ngos?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Total NGOs</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-success mb-1">
                  {verifiedCount}
                </div>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-warning mb-1">
                  {pendingCount}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-1">
                  {filteredNGOs.length}
                </div>
                <p className="text-sm text-muted-foreground">Filtered Results</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NGOs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant={filterVerified === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterVerified('all')}
          >
            All
          </Button>
          <Button
            variant={filterVerified === 'verified' ? 'default' : 'outline'}
            onClick={() => setFilterVerified('verified')}
          >
            Verified
          </Button>
          <Button
            variant={filterVerified === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterVerified('pending')}
          >
            Pending
          </Button>
        </div>

        {/* NGO List */}
        {filteredNGOs.length > 0 ? (
          <div className="space-y-3">
            {filteredNGOs.map((ngo: any, index: number) => (
              <Card
                key={ngo._id}
                className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                        <Building2 className="h-7 w-7 text-primary-foreground" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {ngo.name}
                          </h3>
                          {ngo.verified && (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {ngo.category && <Badge>{ngo.category}</Badge>}
                          {ngo.state && (
                            <Badge variant="secondary">{ngo.state}</Badge>
                          )}
                          <Badge
                            variant={ngo.verified ? 'default' : 'outline'}
                            className={
                              ngo.verified
                                ? 'bg-success/20 text-success border-success/30'
                                : 'border-warning text-warning'
                            }
                          >
                            {ngo.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </div>
                        {ngo.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {ngo.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                          Registration
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ngo.registrationNumber || 'N/A'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/ngos/${ngo._id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        {!ngo.verified && (
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90"
                            onClick={() =>
                              verifyMutation.mutate({
                                id: ngo._id,
                                verified: true,
                              })
                            }
                            disabled={verifyMutation.isPending}
                          >
                            {verifyMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Verify
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || filterVerified !== 'all'
                  ? 'No NGOs found matching your criteria'
                  : 'No NGOs registered yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllNGOs;
