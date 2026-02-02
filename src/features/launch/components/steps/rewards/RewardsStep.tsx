// -----------------------------------------------------------------------------
// RewardsStep Component
// Stepwise configuration: select products, then measurementType, then allocationType, etc.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProductsSelection } from '../../hooks/useProductsSelection';
import { useRewardsConfig } from '../../hooks/useRewardsConfig';
import { cn } from '@/lib/utils';

const MEASUREMENT_TYPES = [
  { id: 'quantity', label: 'Quantity' },
  { id: 'value', label: 'Value' },
  { id: 'frequency', label: 'Frequency' }
];

const ALLOCATION_TYPES = [
  { id: 'fixed', label: 'Fixed' },
  { id: 'variable', label: 'Variable' },
  { id: 'tiered', label: 'Tiered' }
];

export const RewardsStep: React.FC = () => {
  // Step: 0 = products, 1 = measurement, 2 = allocation, 3 = next...
  const [step, setStep] = useState(0);

  // Product selection
  const {
    availableProducts,
    selectedProductIds,
    selectedProducts,
    toggleProduct,
    isValid: productsValid
  } = useProductsSelection();

  // Rewards config
  const {
    config,
    updateConfig,
    isValid: configValid
  } = useRewardsConfig();

  // Local state for measurementType and allocationType
  const [measurementType, setMeasurementType] = useState<string>(config.measurementType || '');
  const [allocationType, setAllocationType] = useState<string>(config.allocationType || '');

  // Stepwise handlers
  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  // Save measurementType and allocationType to config
  React.useEffect(() => {
    if (measurementType) updateConfig('measurementType' as any, measurementType as any);
  }, [measurementType]);
  React.useEffect(() => {
    if (allocationType) updateConfig('allocationType', allocationType as any);
  }, [allocationType]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <StepIndicator active={step === 0} done={step > 0} label="Products" />
          <StepIndicator active={step === 1} done={step > 1} label="Measurement" />
          <StepIndicator active={step === 2} done={step > 2} label="Allocation" />
        </div>
      </div>

      {/* Step 0: Product Selection */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="launch.rewards.selectProducts" defaultMessage="Select Products for Rewards" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage id="launch.rewards.selectProducts.desc" defaultMessage="Choose which products will be available as rewards in this program." />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    'border rounded-lg p-4 flex flex-col gap-2 cursor-pointer transition-all',
                    selectedProductIds.includes(product.id)
                      ? 'border-primary bg-primary/10'
                      : 'hover:border-primary'
                  )}
                  onClick={() => toggleProduct(product)}
                >
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.description}</div>
                  {product.points && (
                    <div className="text-xs text-primary font-medium">
                      <FormattedMessage id="launch.rewards.product.points" defaultMessage="{points} points" values={{ points: product.points }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleNext}
                disabled={!productsValid}
                size="lg"
              >
                <FormattedMessage id="launch.rewards.next" defaultMessage="Next" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Measurement Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="launch.rewards.measurementType" defaultMessage="Select Measurement Type" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage id="launch.rewards.measurementType.desc" defaultMessage="How will achievement be measured for rewards?" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {MEASUREMENT_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant={measurementType === type.id ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setMeasurementType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                <FormattedMessage id="launch.rewards.back" defaultMessage="Back" />
              </Button>
              <Button
                onClick={handleNext}
                disabled={!measurementType}
                size="lg"
              >
                <FormattedMessage id="launch.rewards.next" defaultMessage="Next" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Allocation Type */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="launch.rewards.allocationType" defaultMessage="Select Allocation Type" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage id="launch.rewards.allocationType.desc" defaultMessage="How will rewards be allocated?" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {ALLOCATION_TYPES.map((type) => (
                <Button
                  key={type.id}
                  variant={allocationType === type.id ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setAllocationType(type.id)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                <FormattedMessage id="launch.rewards.back" defaultMessage="Back" />
              </Button>
              <Button
                onClick={handleNext}
                disabled={!allocationType}
                size="lg"
              >
                <FormattedMessage id="launch.rewards.next" defaultMessage="Next" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Continue with rest of rewards config... */}
      {step > 2 && (
        <div>
          {/* Render the rest of the rewards configuration as before */}
          {/* You can insert the existing RewardsBlockList, ManagerRewardsConfig, etc. here */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="launch.rewards.advancedConfig" defaultMessage="Continue Rewards Configuration" />
              </CardTitle>
              <CardDescription>
                <FormattedMessage id="launch.rewards.advancedConfig.desc" defaultMessage="Configure advanced reward options below." />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholders for advanced config */}
              <div className="text-muted-foreground">
                <FormattedMessage id="launch.rewards.advancedConfig.placeholder" defaultMessage="Continue with the rest of the rewards setup..." />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Step indicator component
const StepIndicator: React.FC<{ active: boolean; done: boolean; label: string }> = ({ active, done, label }) => (
  <div className={cn(
    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
    active ? 'bg-primary text-primary-foreground' : done ? 'bg-muted text-muted-foreground' : 'bg-muted/50 text-muted-foreground'
  )}>
    {label}
  </div>
);

export default RewardsStep;
