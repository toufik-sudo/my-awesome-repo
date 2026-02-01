// -----------------------------------------------------------------------------
// Rewards Configuration Demo Page
// Demo page to test the GoalAllocationStep component
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoalAllocationStep } from '@/components/goals/GoalAllocationStep';
import type { Product, GoalAllocation } from '@/types/goals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock configured products (simulating API data)
const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Smartphone Galaxy S24', imageUrl: '' },
  { id: 'prod-2', name: 'Laptop MacBook Pro', imageUrl: '' },
  { id: 'prod-3', name: 'Écouteurs AirPods Pro', imageUrl: '' },
  { id: 'prod-4', name: 'Montre Apple Watch', imageUrl: '' },
  { id: 'prod-5', name: 'Tablette iPad Air', imageUrl: '' },
];

const RewardsConfigDemo: React.FC = () => {
  const [completedGoals, setCompletedGoals] = useState<GoalAllocation[] | null>(null);
  const [step, setStep] = useState<'config' | 'summary'>('config');

  const handleComplete = (goals: GoalAllocation[]) => {
    setCompletedGoals(goals);
    setStep('summary');
    toast.success(`${goals.length} objectif(s) configuré(s) avec succès!`);
  };

  const handleBack = () => {
    setStep('config');
    setCompletedGoals(null);
  };

  const getProductName = (productId: string) => {
    if (productId === 'general') return 'Produit général';
    return MOCK_PRODUCTS.find(p => p.id === productId)?.name || productId;
  };

  const getMeasurementLabel = (type: string) => {
    const labels: Record<string, string> = {
      actions: 'Actions',
      revenue: 'Chiffre d\'affaire',
      volume: 'Volume'
    };
    return labels[type] || type;
  };

  const getAllocationLabel = (type: string) => {
    const labels: Record<string, string> = {
      fixed: 'Points fixes',
      percentage: 'Pourcentage',
      brackets: 'Paliers'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Configuration des Récompenses</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {step === 'config' ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <CardTitle>Étape REWARDS - Configuration des objectifs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <GoalAllocationStep
                configuredProducts={MOCK_PRODUCTS}
                onComplete={handleComplete}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-green-700">
                    Configuration terminée!
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Vous avez configuré {completedGoals?.length} objectif(s) pour votre programme.
                </p>

                {completedGoals?.map((goal, index) => (
                  <Card key={index} className="bg-card">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium">Objectif {index + 1}</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {getProductName(goal.productId)}
                            </Badge>
                            <Badge variant="secondary">
                              {getMeasurementLabel(goal.measurementType || '')}
                            </Badge>
                            <Badge>
                              {getAllocationLabel(goal.allocationType || '')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    Modifier les objectifs
                  </Button>
                  <Button onClick={() => toast.info('Navigation vers l\'étape suivante...')}>
                    Continuer vers DESIGN
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default RewardsConfigDemo;
