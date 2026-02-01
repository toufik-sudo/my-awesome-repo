// -----------------------------------------------------------------------------
// Payment Method Page
// Migrated from old_app/src/components/pages/PaymentMethodPage.tsx
// Page for managing payment methods during onboarding
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Building2, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const PaymentMethodPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = React.useState('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Process payment method
    console.log('Payment method:', paymentMethod);
    navigate('/wall');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            {formatMessage({ id: 'payment.title', defaultMessage: 'Payment Method' })}
          </h1>
          <p className="text-muted-foreground mt-2">
            {formatMessage({ id: 'payment.subtitle', defaultMessage: 'Add a payment method to complete your subscription' })}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {formatMessage({ id: 'payment.selectMethod', defaultMessage: 'Select Payment Method' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div
                  className={cn(
                    "flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    paymentMethod === 'card' && "border-primary bg-primary/5"
                  )}
                  onClick={() => setPaymentMethod('card')}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {formatMessage({ id: 'payment.creditCard', defaultMessage: 'Credit / Debit Card' })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </Label>
                </div>

                <div
                  className={cn(
                    "flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    paymentMethod === 'sepa' && "border-primary bg-primary/5"
                  )}
                  onClick={() => setPaymentMethod('sepa')}
                >
                  <RadioGroupItem value="sepa" id="sepa" />
                  <Label htmlFor="sepa" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {formatMessage({ id: 'payment.sepa', defaultMessage: 'SEPA Bank Transfer' })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatMessage({ id: 'payment.sepa.description', defaultMessage: 'Direct bank debit (EU only)' })}
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {formatMessage({ id: 'payment.cardDetails', defaultMessage: 'Card Details' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">
                    {formatMessage({ id: 'payment.cardNumber', defaultMessage: 'Card Number' })}
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">
                      {formatMessage({ id: 'payment.expiry', defaultMessage: 'Expiry Date' })}
                    </Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">
                      {formatMessage({ id: 'payment.cvc', defaultMessage: 'CVC' })}
                    </Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    {formatMessage({ id: 'payment.cardholderName', defaultMessage: 'Cardholder Name' })}
                  </Label>
                  <Input
                    id="name"
                    placeholder={formatMessage({ id: 'payment.cardholderName.placeholder', defaultMessage: 'Name on card' })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEPA Details */}
          {paymentMethod === 'sepa' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {formatMessage({ id: 'payment.bankDetails', defaultMessage: 'Bank Details' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="iban">
                    {formatMessage({ id: 'payment.iban', defaultMessage: 'IBAN' })}
                  </Label>
                  <Input
                    id="iban"
                    placeholder="FR76 3000 6000 0112 3456 7890 189"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolder">
                    {formatMessage({ id: 'payment.accountHolder', defaultMessage: 'Account Holder' })}
                  </Label>
                  <Input
                    id="accountHolder"
                    placeholder={formatMessage({ id: 'payment.accountHolder.placeholder', defaultMessage: 'Full name' })}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Shield className="h-4 w-4" />
            <span>
              {formatMessage({ id: 'payment.secure', defaultMessage: 'Your payment information is encrypted and secure' })}
            </span>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" size="lg">
            {formatMessage({ id: 'payment.continue', defaultMessage: 'Continue' })}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
