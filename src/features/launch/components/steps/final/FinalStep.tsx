// -----------------------------------------------------------------------------
// Final Step Component
// Program launch summary and confirmation
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  Rocket,
  Calendar,
  Users,
  Target,
  CreditCard,
  Palette,
  FileText,
  Share2,
  Bot,
  Loader2,
  ChevronRight,
  AlertTriangle,
  PartyPopper,
} from 'lucide-react';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import { WALL_ROUTE } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface SummarySection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string | number | boolean | undefined }[];
  status: 'complete' | 'incomplete' | 'optional';
}

export const FinalStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { launchData, launchProgram, isLaunching, goToStep } = useLaunchWizard();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [launchSuccess, setLaunchSuccess] = useState(false);

  // Build summary sections
  const sections: SummarySection[] = [
    {
      id: 'program',
      title: formatMessage({ id: 'final.section.program', defaultMessage: 'Program Details' }),
      icon: <Target className="h-5 w-5 text-primary" />,
      items: [
        { label: formatMessage({ id: 'final.programName', defaultMessage: 'Name' }), value: launchData.programName as string },
        { label: formatMessage({ id: 'final.programType', defaultMessage: 'Type' }), value: launchData.type as string },
        { label: formatMessage({ id: 'final.confidentiality', defaultMessage: 'Confidentiality' }), value: launchData.confidentiality as string },
      ],
      status: launchData.programName && launchData.type ? 'complete' : 'incomplete',
    },
    {
      id: 'dates',
      title: formatMessage({ id: 'final.section.dates', defaultMessage: 'Duration' }),
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.startDate', defaultMessage: 'Start' }),
          value: (launchData.duration as { start?: string })?.start || 'Not set',
        },
        {
          label: formatMessage({ id: 'final.endDate', defaultMessage: 'End' }),
          value: (launchData.duration as { end?: string })?.end || 'No end date',
        },
      ],
      status: (launchData.duration as { start?: string })?.start ? 'complete' : 'incomplete',
    },
    {
      id: 'users',
      title: formatMessage({ id: 'final.section.users', defaultMessage: 'Participants' }),
      icon: <Users className="h-5 w-5 text-green-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.invitationMethod', defaultMessage: 'Invitation Method' }),
          value: launchData.invitationMethod as string || 'Not configured',
        },
        {
          label: formatMessage({ id: 'final.fieldsCount', defaultMessage: 'User Fields' }),
          value: (launchData.invitedUsersFields as string[])?.length || 0,
        },
      ],
      status: launchData.invitedUsersFields ? 'complete' : 'incomplete',
    },
    {
      id: 'rewards',
      title: formatMessage({ id: 'final.section.rewards', defaultMessage: 'Rewards' }),
      icon: <CreditCard className="h-5 w-5 text-yellow-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.allocationType', defaultMessage: 'Allocation' }),
          value: launchData.allocationType as string || 'Default',
        },
      ],
      status: 'optional',
    },
    {
      id: 'ecards',
      title: formatMessage({ id: 'final.section.ecards', defaultMessage: 'Gift Cards' }),
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.ecardsSelected', defaultMessage: 'Selected' }),
          value: (launchData.eCardSelectdList as any[])?.length || 0,
        },
      ],
      status: (launchData.eCardSelectdList as any[])?.length ? 'complete' : 'optional',
    },
    {
      id: 'ai',
      title: formatMessage({ id: 'final.section.ai', defaultMessage: 'AI Assistant' }),
      icon: <Bot className="h-5 w-5 text-cyan-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.aiAssistant', defaultMessage: 'Assistant' }),
          value: (launchData.iaCompany as { iaName?: string })?.iaName || 'None',
        },
      ],
      status: (launchData.iaCompany as { iaName?: string })?.iaName ? 'complete' : 'optional',
    },
    {
      id: 'design',
      title: formatMessage({ id: 'final.section.design', defaultMessage: 'Design' }),
      icon: <Palette className="h-5 w-5 text-pink-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.companyName', defaultMessage: 'Company' }),
          value: launchData.companyName as string || 'Not set',
        },
        {
          label: formatMessage({ id: 'final.hasLogo', defaultMessage: 'Logo' }),
          value: launchData.companyLogo ? 'Uploaded' : 'Not uploaded',
        },
      ],
      status: launchData.companyName ? 'complete' : 'optional',
    },
    {
      id: 'content',
      title: formatMessage({ id: 'final.section.content', defaultMessage: 'Content' }),
      icon: <FileText className="h-5 w-5 text-orange-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.contentSections', defaultMessage: 'Sections' }),
          value: (launchData.contentSections as any[])?.filter((s) => s.content || s.bannerImage).length || 0,
        },
      ],
      status: 'optional',
    },
    {
      id: 'social',
      title: formatMessage({ id: 'final.section.social', defaultMessage: 'Social Networks' }),
      icon: <Share2 className="h-5 w-5 text-indigo-500" />,
      items: [
        {
          label: formatMessage({ id: 'final.socialLinked', defaultMessage: 'Linked' }),
          value: (launchData.socialMediaAccounts as any[])?.filter((s) => s.enabled && s.url).length || 0,
        },
      ],
      status: 'optional',
    },
  ];

  const requiredSections = sections.filter((s) => s.status === 'incomplete');
  const canLaunch = requiredSections.length === 0 && termsAccepted;

  const handleLaunch = async () => {
    if (!canLaunch) return;

    setLaunchError(null);
    try {
      await launchProgram();
      setLaunchSuccess(true);
    } catch (error) {
      setLaunchError(
        formatMessage({ id: 'final.error', defaultMessage: 'Failed to launch program. Please try again.' })
      );
    }
  };

  if (launchSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
          <div className="relative bg-green-500 rounded-full p-6">
            <PartyPopper className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-600">
            {formatMessage({ id: 'final.success.title', defaultMessage: 'Program Launched!' })}
          </h1>
          <p className="text-muted-foreground max-w-md">
            {formatMessage({
              id: 'final.success.description',
              defaultMessage: 'Your program has been successfully created and is now active.',
            })}
          </p>
        </div>
        <Button size="lg" onClick={() => navigate(WALL_ROUTE)} className="gap-2">
          {formatMessage({ id: 'final.goToPrograms', defaultMessage: 'Go to Programs' })}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">
            {formatMessage({ id: 'final.title', defaultMessage: 'Ready to Launch' })}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {formatMessage({
            id: 'final.subtitle',
            defaultMessage: 'Review your program configuration before launching.',
          })}
        </p>
      </div>

      {/* Incomplete Sections Warning */}
      {requiredSections.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {formatMessage(
              { id: 'final.incompleteWarning', defaultMessage: 'Please complete the following sections: {sections}' },
              { sections: requiredSections.map((s) => s.title).join(', ') }
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card
            key={section.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              section.status === 'complete' && 'border-green-200 bg-green-50/50',
              section.status === 'incomplete' && 'border-red-200 bg-red-50/50',
              section.status === 'optional' && 'border-muted'
            )}
            onClick={() => goToStep(section.id, 1)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  {section.icon}
                  {section.title}
                </CardTitle>
                {section.status === 'complete' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {section.status === 'incomplete' && (
                  <Badge variant="destructive" className="text-xs">
                    {formatMessage({ id: 'common.required', defaultMessage: 'Required' })}
                  </Badge>
                )}
                {section.status === 'optional' && (
                  <Badge variant="secondary" className="text-xs">
                    {formatMessage({ id: 'common.optional', defaultMessage: 'Optional' })}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <dl className="space-y-1 text-sm">
                {section.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <dt className="text-muted-foreground">{item.label}:</dt>
                    <dd className="font-medium capitalize">
                      {typeof item.value === 'boolean'
                        ? item.value
                          ? 'Yes'
                          : 'No'
                        : item.value || '-'}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Terms */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              {formatMessage({
                id: 'final.termsText',
                defaultMessage:
                  'I confirm that all the information provided is accurate and I agree to the terms and conditions for launching this program.',
              })}
            </Label>
          </div>
        </CardContent>
      </Card>

      {launchError && (
        <Alert variant="destructive">
          <AlertDescription>{launchError}</AlertDescription>
        </Alert>
      )}

      {/* Launch Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleLaunch}
          size="lg"
          disabled={!canLaunch || isLaunching}
          className="gap-2 min-w-[200px]"
        >
          {isLaunching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {formatMessage({ id: 'final.launching', defaultMessage: 'Launching...' })}
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              {formatMessage({ id: 'final.launchProgram', defaultMessage: 'Launch Program' })}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinalStep;
