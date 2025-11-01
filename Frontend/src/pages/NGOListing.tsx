import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Building2, Search, MapPin, Heart, CheckCircle, Loader2 } from 'lucide-react';
import { publicService } from '@/services/publicService';
import { DonateModal } from '@/components/DonateModal';
import { formatCurrency } from '@/lib/utils';

const NGOListing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNGO, setSelectedNGO] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedNGOForDetails, setSelectedNGOForDetails] = useState<any>(null);

  const { data: ngos, isLoading, error } = useQuery({
    queryKey: ['publicNGOs'],
    queryFn: () => publicService.getAllNGOs(),
  });

  const filteredNGOs =
    ngos?.filter((ngo) => {
      if (!searchQuery) return ngo.verified;
      return (
        ngo.verified &&
        (ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ngo.category?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }) || [];

  const handleDonateClick = (ngoId: string, ngoName: string) => {
    setSelectedNGO({ id: ngoId, name: ngoName });
    setDonateModalOpen(true);
  };

  const handleViewDetails = async (ngoId: string) => {
    try {
      const details = await publicService.getNGODetails(ngoId);
      setSelectedNGOForDetails(details);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error('Failed to load NGO details:', error);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover NGOs</h1>
          <p className="text-muted-foreground mt-2">
            Find verified organizations making a real difference
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NGOs by name or sector..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="p-6">
            <CardContent className="text-center">
              <p className="text-destructive">Failed to load NGOs</p>
              <p className="text-sm text-muted-foreground mt-2">
                {(error as Error).message}
              </p>
            </CardContent>
          </Card>
        ) : filteredNGOs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredNGOs.map((ngo) => (
              <Card key={ngo._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {ngo.name}
                          {ngo.verified && (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </CardTitle>
                        {ngo.state && (
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {ngo.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {ngo.category && <Badge>{ngo.category}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription>
                    {ngo.description || 'No description available'}
                  </CardDescription>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-gradient-accent hover:opacity-90"
                      onClick={() => handleDonateClick(ngo._id, ngo.name)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Donate Now
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleViewDetails(ngo._id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No NGOs found matching your search'
                  : 'No verified NGOs available'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Donate Modal */}
        {selectedNGO && (
          <DonateModal
            open={donateModalOpen}
            onOpenChange={setDonateModalOpen}
            ngoId={selectedNGO.id}
            ngoName={selectedNGO.name}
          />
        )}

        {/* Details Modal */}
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedNGOForDetails?.name || 'NGO Details'}
              </DialogTitle>
              <DialogDescription>
                Complete information about this organization
              </DialogDescription>
            </DialogHeader>
            {selectedNGOForDetails && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Registration Number</p>
                  <p className="text-muted-foreground">
                    {selectedNGOForDetails.registrationNumber}
                  </p>
                </div>
                {selectedNGOForDetails.description && (
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-muted-foreground">
                      {selectedNGOForDetails.description}
                    </p>
                  </div>
                )}
                {selectedNGOForDetails.category && (
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <Badge>{selectedNGOForDetails.category}</Badge>
                  </div>
                )}
                {selectedNGOForDetails.state && (
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-muted-foreground">
                      {selectedNGOForDetails.state}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1 bg-gradient-accent hover:opacity-90"
                    onClick={() => {
                      setDetailsModalOpen(false);
                      handleDonateClick(
                        selectedNGOForDetails._id,
                        selectedNGOForDetails.name
                      );
                    }}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Now
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

export default NGOListing;
