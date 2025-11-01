import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { ngoService, Spending } from '@/services/ngoService';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const SpendingTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const { data: spending, isLoading, error } = useQuery({
    queryKey: ['ngo-spending'],
    queryFn: () => ngoService.getSpending(),
  });

  const { data: dashboardData } = useQuery({
    queryKey: ['ngo-dashboard'],
    queryFn: () => ngoService.getDashboard(),
  });

  const addSpendingMutation = useMutation({
    mutationFn: (data: Omit<Spending, '_id' | 'ngoId' | 'date'>) =>
      ngoService.addSpending(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ngo-spending'] });
      queryClient.invalidateQueries({ queryKey: ['ngo-dashboard'] });
      toast({
        title: 'Spending added',
        description: 'Spending record added successfully',
      });
      setFormData({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
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

  const deleteSpendingMutation = useMutation({
    mutationFn: async (id: string) => {
      // Note: Backend doesn't have delete endpoint, we'll skip this or implement update
      throw new Error('Delete not implemented yet');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) {
      toast({
        title: 'Validation Error',
        description: 'Category and amount are required',
        variant: 'destructive',
      });
      return;
    }
    addSpendingMutation.mutate({
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date ? new Date(formData.date).toISOString() : undefined,
    });
  };

  const stats = dashboardData?.stats || {
    totalReceived: 0,
    totalSpent: 0,
    available: 0,
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
              <p className="text-destructive">Failed to load spending</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Spending Tracker</h1>
          <p className="text-muted-foreground mt-2">Record and manage fund utilization</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Add Spending Form */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Add Spending Record</CardTitle>
              <CardDescription>Record how funds are being utilized</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Salaries">Salaries</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Food & Water">Food & Water</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe how funds were used..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                  disabled={addSpendingMutation.isPending}
                >
                  {addSpendingMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Spending Record
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Spending */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Spending</CardTitle>
              <CardDescription>Latest fund utilization records</CardDescription>
            </CardHeader>
            <CardContent>
              {spending && spending.length > 0 ? (
                <div className="space-y-3">
                  {spending.map((item: Spending, index: number) => (
                    <div
                      key={item._id}
                      className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-all duration-300 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge>{item.category}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.date)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No spending records yet</p>
                  <p className="text-sm mt-2">
                    Add your first spending record to start tracking
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(stats.totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All spending records
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Funds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {formatCurrency(stats.available)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to deploy
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Utilization Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {stats.totalReceived > 0
                  ? Math.round((stats.totalSpent / stats.totalReceived) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Of total funds
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Records Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {spending?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total records
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SpendingTracker;
