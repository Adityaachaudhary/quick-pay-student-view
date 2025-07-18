import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Lock, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentPage() {
  const { currentUser, payFees } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  if (currentUser.feesPaid) {
    navigate('/profile');
    return null;
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digitsOnly.length >= 2) {
      return digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4);
    }
    return digitsOnly;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.slice(0, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgress(0);

    // Simulate payment processing with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const success = await payFees();
      
      if (success) {
        setProgress(100);
        setTimeout(() => {
          setIsComplete(true);
          toast({
            title: "Payment Successful!",
            description: "Your fees have been paid successfully.",
          });
          
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        }, 500);
      }
    } catch (err) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
    
    clearInterval(progressInterval);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-elegant text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your fees have been paid successfully. You will be redirected to your profile shortly.
            </p>
            <div className="w-8 h-8 mx-auto">
              <Loader2 className="h-full w-full animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </Button>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment</h1>
          <p className="text-muted-foreground">Complete your fee payment securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Details</span>
                </CardTitle>
                <CardDescription>
                  Enter your payment information below
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Processing Payment...</span>
                      <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      type="text"
                      placeholder="Enter cardholder name"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      required
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={handleCvvChange}
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardType">Card Type</Label>
                    <Select required disabled={isProcessing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay Now - $2,500.00
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>Review your payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student</span>
                  <span className="font-medium">{currentUser.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-sm">{currentUser.email}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tuition Fee</span>
                    <span>$2,200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activity Fee</span>
                    <span>$150.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technology Fee</span>
                    <span>$100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Library Fee</span>
                    <span>$50.00</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span className="text-primary">$2,500.00</span>
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Your payment is secured with 256-bit SSL encryption</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}