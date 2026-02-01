import React, { useState, forwardRef } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CONTACT } from '@/constants/routes';
import { contactFormApi } from '@/api/ContactFormApi';

const contactSchema = z.object({
  name: z.string().min(1, 'validation.required').max(100),
  email: z.string().email('validation.email.invalid'),
  message: z.string().min(10, 'validation.message.minLength').max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Contact section with form
 */
const ContactSection = forwardRef<HTMLElement>((props, ref) => {
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await contactFormApi.submitContactForm({
        name: data.name,
        email: data.email,
        message: data.message,
      });
      
      toast.success(intl.formatMessage({ id: 'contact.success' }));
      reset();
    } catch (error) {
      console.error('Contact form submission failed:', error);
      toast.error(intl.formatMessage({ id: 'contact.error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={ref}
      id={CONTACT} 
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {intl.formatMessage({ id: 'contact.title' })}
            </h2>
            <p className="text-muted-foreground">
              {intl.formatMessage({ id: 'contact.subtitle' })}
            </p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {intl.formatMessage({ id: 'contact.name.label' })}
                </Label>
                <Input
                  id="name"
                  placeholder={intl.formatMessage({ id: 'contact.name.placeholder' })}
                  {...register('name')}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {intl.formatMessage({ id: errors.name.message || 'validation.required' })}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  {intl.formatMessage({ id: 'contact.email.label' })}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={intl.formatMessage({ id: 'contact.email.placeholder' })}
                  {...register('email')}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {intl.formatMessage({ id: errors.email.message || 'validation.required' })}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">
                {intl.formatMessage({ id: 'contact.message.label' })}
              </Label>
              <Textarea
                id="message"
                placeholder={intl.formatMessage({ id: 'contact.message.placeholder' })}
                rows={5}
                {...register('message')}
                disabled={isSubmitting}
              />
              {errors.message && (
                <p className="text-sm text-destructive">
                  {intl.formatMessage({ id: errors.message.message || 'validation.required' })}
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              size="lg"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                intl.formatMessage({ id: 'contact.sending' })
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {intl.formatMessage({ id: 'contact.submit' })}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
