import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  DollarSign,
  ShieldCheck,
  Clock,
  Loader2,
  Eye,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminService.getDashboard(),
  });

  const { data: pendingNGOs } = useQuery({
    queryKey: ["admin-pending-ngos"],
    queryFn: () => adminService.getPendingNGOs(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      adminService.verifyNGO(id, verified),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-ngos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-ngos"] });
      queryClient.invalidateQueries({ queryKey: ["publicNGOs"] });
      toast({
        title: variables.verified ? "NGO Verified" : "NGO Unverified",
        description: `NGO ${
          variables.verified ? "verified" : "unverified"
        } successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const stats = dashboardData?.stats || {
    totalNGOs: 0,
    verifiedNGOs: 0,
    pendingNGOs: 0,
    totalDonors: 0,
    totalDonations: 0,
    totalAmount: 0,
    totalSocialEvents: 0,
  };

  const [selectedNGO, setSelectedNGO] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (ngo: any) => {
    setSelectedNGO(ngo);
    setDetailsOpen(true);
  };

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
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor platform activity and verify NGOs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total NGOs</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalNGOs}</div>
              <p className="text-xs text-muted-foreground">
                {stats.verifiedNGOs} verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Donors
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonors}</div>
              <p className="text-xs text-muted-foreground">
                Active contributors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Platform Donations
              </CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalDonations} donation
                {stats.totalDonations !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Verifications
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingNGOs}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        {/* Verification Queue */}
        <Card>
          <CardHeader>
            <CardTitle>NGO Verification Queue</CardTitle>
            <CardDescription>
              Review and approve pending NGO registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingNGOs && pendingNGOs.length > 0 ? (
              <div className="space-y-4">
                {pendingNGOs.slice(0, 5).map((ngo: any) => {
                  const createdAt = ngo.createdAt
                    ? new Date(ngo.createdAt).toLocaleDateString()
                    : "N/A";
                  return (
                    <div
                      key={ngo._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{ngo.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {ngo.category && (
                                <Badge variant="secondary">
                                  {ngo.category}
                                </Badge>
                              )}
                              {ngo.state && (
                                <Badge variant="outline">{ngo.state}</Badge>
                              )}
                              <span className="text-sm text-muted-foreground">
                                Registered: {createdAt}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(ngo)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        {/* Details Dialog */}
                        <Dialog
                          open={detailsOpen}
                          onOpenChange={setDetailsOpen}
                        >
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                {selectedNGO?.name || "NGO Details"}
                              </DialogTitle>
                              <DialogDescription>
                                Complete NGO information
                              </DialogDescription>
                            </DialogHeader>
                            {selectedNGO && (
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium">
                                    Registration Number
                                  </p>
                                  <p className="text-muted-foreground">
                                    {selectedNGO.registrationNumber}
                                  </p>
                                </div>
                                {selectedNGO.description && (
                                  <div>
                                    <p className="text-sm font-medium">
                                      Description
                                    </p>
                                    <p className="text-muted-foreground">
                                      {selectedNGO.description}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium">
                                    Category
                                  </p>
                                  <p className="text-muted-foreground">
                                    {selectedNGO.category}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">State</p>
                                  <p className="text-muted-foreground">
                                    {selectedNGO.state}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Verified
                                  </p>
                                  <p className="text-muted-foreground">
                                    {selectedNGO.verified ? "Yes" : "No"}
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No pending NGOs</p>
                <p className="text-sm mt-2">All NGOs have been reviewed</p>
              </div>
            )}
            {pendingNGOs && pendingNGOs.length > 5 && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/admin/verify-ngos")}
              >
                View All Pending ({pendingNGOs.length})
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/ngos")}
          >
            <CardHeader>
              <CardTitle className="text-lg">View All NGOs</CardTitle>
              <CardDescription>
                Browse and manage all registered NGOs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/analytics")}
          >
            <CardHeader>
              <CardTitle className="text-lg">Platform Analytics</CardTitle>
              <CardDescription>
                View detailed platform statistics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/admin/verify")}
          >
            <CardHeader>
              <CardTitle className="text-lg">Verify NGOs</CardTitle>
              <CardDescription>
                Review and verify pending NGO registrations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
