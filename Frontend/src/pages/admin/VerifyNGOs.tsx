import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Building2,
  ShieldCheck,
  Eye,
  Search,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const VerifyNGOs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNGO, setSelectedNGO] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const {
    data: pendingNGOs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-pending-ngos"],
    queryFn: () => adminService.getPendingNGOs(),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, verified }: { id: string; verified: boolean }) =>
      adminService.verifyNGO(id, verified),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending-ngos"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-all-ngos"] });
      queryClient.invalidateQueries({ queryKey: ["publicNGOs"] });
      toast({
        title: variables.verified ? "NGO Verified" : "NGO Unverified",
        description: `NGO ${
          variables.verified ? "verified" : "unverified"
        } successfully`,
      });
      setDetailsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredNGOs =
    pendingNGOs?.filter((ngo: any) => {
      if (!searchQuery) return true;
      return (
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.state?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }) || [];

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
              <p className="text-destructive">Failed to load pending NGOs</p>
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
          <h1 className="text-3xl font-bold tracking-tight">
            NGO Verification
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and approve pending NGO registrations
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {pendingNGOs?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting verification
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total NGOs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {pendingNGOs?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requiring review
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {pendingNGOs && pendingNGOs.length > 0 ? "Active" : "Clear"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Review queue</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pending NGOs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Pending NGOs */}
        {filteredNGOs.length > 0 ? (
          <div className="space-y-4">
            {filteredNGOs.map((ngo: any, index: number) => {
              const userEmail =
                typeof ngo.userId === "object" ? ngo.userId.email : "";
              const userName =
                typeof ngo.userId === "object" ? ngo.userId.name : "";
              const createdAt = ngo.createdAt
                ? formatDate(ngo.createdAt)
                : "N/A";
              return (
                <Card
                  key={ngo._id}
                  className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
                          <Building2 className="h-8 w-8 text-primary-foreground" />
                        </div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                              {ngo.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {ngo.category && <Badge>{ngo.category}</Badge>}
                              {ngo.state && (
                                <Badge variant="secondary">{ngo.state}</Badge>
                              )}
                              <Badge
                                variant="outline"
                                className="border-warning text-warning"
                              >
                                Pending
                              </Badge>
                            </div>
                            {ngo.description && (
                              <p className="text-sm text-muted-foreground">
                                {ngo.description}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {ngo.documents && ngo.documents.length > 0 && (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>
                                  {ngo.documents.length} document
                                  {ngo.documents.length !== 1 ? "s" : ""}{" "}
                                  submitted
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Registered: {createdAt}</span>
                            </div>
                            {userEmail && (
                              <div className="flex items-center gap-2">
                                <span>Contact: {userEmail}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:w-48">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => handleViewDetails(ngo)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="w-full bg-success hover:bg-success/90 shadow-glow"
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-border/50 shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No NGOs found matching your search"
                  : "No pending NGOs"}
              </p>
              {!searchQuery && (
                <p className="text-sm mt-2">
                  All NGOs have been reviewed and verified
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedNGO?.name || "NGO Details"}</DialogTitle>
              <DialogDescription>Complete NGO information</DialogDescription>
            </DialogHeader>
            {selectedNGO && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Registration Number</p>
                  <p className="text-muted-foreground">
                    {selectedNGO.registrationNumber}
                  </p>
                </div>
                {selectedNGO.description && (
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-muted-foreground">
                      {selectedNGO.description}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {selectedNGO.category && (
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <Badge>{selectedNGO.category}</Badge>
                    </div>
                  )}
                  {selectedNGO.state && (
                    <div>
                      <p className="text-sm font-medium">State</p>
                      <p className="text-muted-foreground">
                        {selectedNGO.state}
                      </p>
                    </div>
                  )}
                </div>
                {typeof selectedNGO.userId === "object" && (
                  <div>
                    <p className="text-sm font-medium">Contact</p>
                    <p className="text-muted-foreground">
                      {selectedNGO.userId.name} ({selectedNGO.userId.email})
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDetailsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() =>
                      verifyMutation.mutate({
                        id: selectedNGO._id,
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
                        Verify NGO
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default VerifyNGOs;
