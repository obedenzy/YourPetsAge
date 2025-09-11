import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser, useUpdateTokens } from "@/hooks/use-user";

export default function Checkout() {
  const [location] = useLocation();
  const { data: user } = useUser();
  const updateTokens = useUpdateTokens();
  const { toast } = useToast();
  
  const [planType, setPlanType] = useState<"tokens" | "subscription">("tokens");
  const [tokenAmount, setTokenAmount] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingName, setBillingName] = useState("");

  useEffect(() => {
    // Parse URL parameters to determine plan type
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const plan = searchParams.get('plan');
    if (plan === 'subscription' || plan === 'tokens') {
      setPlanType(plan);
    }
  }, [location]);

  const tokenPackages = [
    { amount: 5, price: 5, bonus: 0, popular: false },
    { amount: 10, price: 10, bonus: 0, popular: false },
    { amount: 25, price: 23, bonus: 2, popular: true },
    { amount: 50, price: 45, bonus: 5, popular: false },
    { amount: 100, price: 85, bonus: 15, popular: false },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Mock payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (planType === "tokens") {
        // Mock token purchase success
        const newTokenBalance = (user?.tokens || 0) + tokenAmount + (tokenPackages.find(p => p.amount === tokenAmount)?.bonus || 0);
        await updateTokens.mutateAsync(newTokenBalance);
        
        toast({
          title: "Purchase Successful!",
          description: `You've purchased ${tokenAmount} tokens${tokenPackages.find(p => p.amount === tokenAmount)?.bonus ? ` (+${tokenPackages.find(p => p.amount === tokenAmount)?.bonus} bonus)` : ''}!`,
        });
      } else {
        // Mock subscription success
        toast({
          title: "Subscription Active!",
          description: "Welcome to Premium! You now have unlimited access to all features.",
        });
      }
      
      // Redirect to premium page
      window.location.href = "/premium";
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPackage = tokenPackages.find(p => p.amount === tokenAmount);

  return (
    <div className="container mx-auto px-4 py-8" data-testid="checkout-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
          <p className="text-muted-foreground">Secure checkout powered by Stripe</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card data-testid="order-summary">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {planType === "tokens" ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Token Package</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {tokenPackages.map((pkg) => (
                          <div
                            key={pkg.amount}
                            className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                              tokenAmount === pkg.amount 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setTokenAmount(pkg.amount)}
                            data-testid={`token-package-${pkg.amount}`}
                          >
                            {pkg.popular && (
                              <div className="absolute -top-2 left-3 bg-accent text-accent-foreground px-2 py-1 text-xs rounded-full font-medium">
                                Best Value
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">{pkg.amount} Tokens</div>
                                {pkg.bonus > 0 && (
                                  <div className="text-sm text-green-600">+{pkg.bonus} bonus tokens</div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-bold">${pkg.price}</div>
                                {pkg.bonus > 0 && (
                                  <div className="text-xs text-muted-foreground line-through">${pkg.amount}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span>Tokens</span>
                      <span>{tokenAmount}</span>
                    </div>
                    {selectedPackage?.bonus && selectedPackage.bonus > 0 && (
                      <div className="flex justify-between items-center mb-2 text-green-600">
                        <span>Bonus Tokens</span>
                        <span>+{selectedPackage.bonus}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span>${selectedPackage?.price}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Premium Unlimited</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Unlimited access to all premium features
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        Unlimited cosmic reports
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        Ad-free experience
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        Premium AR filters
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-check text-green-500 mr-2"></i>
                        Priority support
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Monthly Subscription</span>
                      <span>$10.00</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Billed monthly, cancel anytime</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card data-testid="payment-form">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger data-testid="select-payment-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      data-testid="input-card-number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        data-testid="input-expiry-date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        data-testid="input-cvv"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="billingName">Name on Card</Label>
                    <Input
                      id="billingName"
                      placeholder="John Doe"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      data-testid="input-billing-name"
                    />
                  </div>
                </div>
              )}

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <i className="fas fa-lock"></i>
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>

              <Button 
                className="w-full py-3 text-lg" 
                onClick={handlePayment}
                disabled={isProcessing}
                data-testid="button-complete-payment"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card mr-2"></i>
                    Complete Payment ${planType === "tokens" ? selectedPackage?.price : "10.00"}
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  By completing this purchase, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
