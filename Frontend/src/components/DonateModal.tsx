import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { paymentService } from '@/services/paymentService';
import { useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface DonateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ngoId: string;
  ngoName: string;
}

export const DonateModal = ({ open, onOpenChange, ngoId, ngoName }: DonateModalProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    try {
      setError('');
      const donationAmount = parseFloat(amount);
      
      if (!donationAmount || donationAmount < 1) {
        setError('Minimum donation amount is ₹1');
        return;
      }

      setLoading(true);

      // Load Razorpay script
      await loadRazorpayScript();

      // Create order
      const orderData = await paymentService.createOrder(ngoId, donationAmount);

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Fund Trust',
        description: `Donation to ${ngoName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ngoId,
              amount: donationAmount,
            });

            queryClient.invalidateQueries({ queryKey: ['donations'] });
            queryClient.invalidateQueries({ queryKey: ['publicNGOs'] });
            queryClient.invalidateQueries({ queryKey: ['ngoDashboard'] });
            queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });

            setLoading(false);
            onOpenChange(false);
            setAmount('');
            alert('Donation successful! Thank you for your contribution.');
          } catch (error: any) {
            setLoading(false);
            setError(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'Donor',
          email: 'donor@example.com',
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        setLoading(false);
        setError(response.error.description || 'Payment failed');
      });

      razorpay.open();
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Failed to process donation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Donate to {ngoName}</DialogTitle>
          <DialogDescription>
            Enter the amount you would like to donate. Your contribution makes a difference!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="amount">Donation Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDonate}
              disabled={loading || !amount}
              className="flex-1 bg-gradient-accent hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Donate Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
