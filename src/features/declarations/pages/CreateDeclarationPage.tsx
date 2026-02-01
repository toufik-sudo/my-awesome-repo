import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Page for creating a new declaration
 */
const CreateDeclarationPage: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    navigate('/declarations');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {intl.formatMessage({ id: 'common.back' })}
        </Button>
        <div>
          <h2 className="text-lg font-semibold">
            {intl.formatMessage({ id: 'declarations.create.title' })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {intl.formatMessage({ id: 'declarations.create.subtitle' })}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 p-4 overflow-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{intl.formatMessage({ id: 'declarations.form.title' })}</CardTitle>
            <CardDescription>
              {intl.formatMessage({ id: 'declarations.form.description' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfEvent">
                    {intl.formatMessage({ id: 'declarations.field.dateOfEvent' })}
                  </Label>
                  <Input id="dateOfEvent" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    {intl.formatMessage({ id: 'declarations.field.quantity' })}
                  </Label>
                  <Input id="quantity" type="number" min="1" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">
                    {intl.formatMessage({ id: 'declarations.field.amount' })}
                  </Label>
                  <Input id="amount" type="number" step="0.01" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">
                    {intl.formatMessage({ id: 'declarations.field.productName' })}
                  </Label>
                  <Input id="productName" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">
                  {intl.formatMessage({ id: 'declarations.field.companyName' })}
                </Label>
                <Input id="companyName" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">
                  {intl.formatMessage({ id: 'declarations.field.comments' })}
                </Label>
                <Textarea id="comments" rows={4} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proofOfSale">
                  {intl.formatMessage({ id: 'declarations.field.proofOfSale' })}
                </Label>
                <Input id="proofOfSale" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png" />
                <p className="text-xs text-muted-foreground">
                  {intl.formatMessage({ id: 'declarations.field.proofOfSale.hint' })}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                  {intl.formatMessage({ id: 'common.cancel' })}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {intl.formatMessage({ id: 'common.submitting' })}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {intl.formatMessage({ id: 'declarations.submit' })}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateDeclarationPage;
