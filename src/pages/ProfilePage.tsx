import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, CreditCard, CheckCircle, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setName(currentUser.name);
    setEmail(currentUser.email);
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await updateProfile({ name, email });
      if (success) {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        setError('Email already exists. Please use a different email.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayFees = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account details and fee payment status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </div>
                  
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex items-center space-x-1"
                      >
                        <Save className="h-4 w-4" />
                        <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setName(currentUser.name);
                          setEmail(currentUser.email);
                          setError('');
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold text-xl">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{currentUser.name}</h3>
                        <p className="text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                        <p className="text-foreground">{currentUser.name}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                        <p className="text-foreground">{currentUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Fee Status Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Fee Status</span>
                </CardTitle>
                <CardDescription>
                  Your current fee payment status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    {currentUser.feesPaid ? (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-sm px-3 py-1">
                          Fees Paid
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          Your fees have been successfully paid. Thank you!
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-warning" />
                        </div>
                        <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 text-sm px-3 py-1">
                          Payment Pending
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          Your fees are still pending. Please make a payment to complete your registration.
                        </p>
                        
                        <Button 
                          onClick={handlePayFees}
                          className="w-full mt-4 gradient-primary"
                        >
                          Pay Fees
                        </Button>
                      </>
                    )}
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