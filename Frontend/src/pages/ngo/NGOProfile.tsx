import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Building2, Save, Loader2 } from 'lucide-react';
import { ngoService } from '@/services/ngoService';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const NGOProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['ngo-profile'],
    queryFn: () => ngoService.getProfile(),
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['ngo-dashboard'],
    queryFn: () => ngoService.getDashboard(),
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    state: '',
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        category: profile.category || '',
        state: profile.state || '',
      });
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<typeof formData>) =>
      ngoService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ngo-profile'] });
      queryClient.invalidateQueries({ queryKey: ['ngo-dashboard'] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const stats = dashboardData?.stats || {
    totalReceived: 0,
    donationCount: 0,
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
              <p className="text-destructive">Failed to load profile</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NGO Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your organization's information</p>
          </div>
          <Badge className="bg-success/20 text-success border-success/30 px-4 py-2">
            <CheckCircle className="mr-2 h-4 w-4" />
            Verified Organization
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Picture */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Organization Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="h-32 w-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Building2 className="h-16 w-16 text-primary-foreground" />
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Upload New Logo
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-border/50 shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle>Organization Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(stats.totalReceived)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold text-accent">
                  {stats.donationCount}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Registration No.</p>
                <p className="text-lg font-bold text-success">
                  {profile?.registrationNumber || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Basic Information */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your organization's details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Primary Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Education, Healthcare"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="state">State/Location</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="e.g., Maharashtra, Delhi"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your organization and mission..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={profile?.registrationNumber || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Registration number cannot be changed
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NGOProfile;
