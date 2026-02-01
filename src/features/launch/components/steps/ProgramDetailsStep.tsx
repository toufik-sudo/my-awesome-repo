// -----------------------------------------------------------------------------
// ProgramDetailsStep Component
// Program name, URL, duration configuration
// -----------------------------------------------------------------------------

import React, { useState, useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Link as LinkIcon, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import { useProgramUrlCheck } from '@/api/hooks/useLaunchApi';
import { WALL_PROGRAM_ROUTE, ROOT } from '@/constants/routes';

const ProgramDetailsStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { 
    launchData, 
    updateStepData, 
    updateMultipleData,
    programType,
    isFreemium 
  } = useLaunchWizard();
  
  const programName = (launchData.programName as string) || '';
  const customUrl = (launchData.extendUrl as string) || '';
  const duration = launchData.duration as { start?: string; end?: string } | undefined;
  
  const [localName, setLocalName] = useState(programName);
  const [localUrl, setLocalUrl] = useState(customUrl);
  const [startDate, setStartDate] = useState<Date | undefined>(
    duration?.start ? new Date(duration.start) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    duration?.end ? new Date(duration.end) : undefined
  );
  
  // URL availability check
  const { data: urlCheck, isLoading: urlChecking } = useProgramUrlCheck(
    localUrl.length >= 3 ? localUrl : undefined
  );
  
  // Generate URL from name
  const generateUrl = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50);
  };
  
  // Auto-generate URL when name changes
  useEffect(() => {
    if (!customUrl && localName) {
      setLocalUrl(generateUrl(localName));
    }
  }, [localName, customUrl]);
  
  // Save to store on change - convert dates to ISO strings for Redux serialization
  useEffect(() => {
    const timer = setTimeout(() => {
      updateMultipleData({
        programName: localName,
        extendUrl: localUrl,
        duration: {
          start: startDate ? startDate.toISOString() : undefined,
          end: endDate ? endDate.toISOString() : undefined,
        },
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localName, localUrl, startDate, endDate, updateMultipleData]);
  
  const baseUrl = `${window.location.origin}${WALL_PROGRAM_ROUTE}/${programType}/`;
  
  const isUrlValid = localUrl.length >= 3 && (urlCheck?.available ?? true);
  const isNameValid = localName.length >= 3;
  const isDateValid = !!startDate;
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.details.title" 
            defaultMessage="Program Details" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.details.description" 
            defaultMessage="Set up the basic information for your program" 
          />
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <FormattedMessage id="launch.details.basic" defaultMessage="Basic Information" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Program Name */}
          <div className="space-y-2">
            <Label htmlFor="programName">
              <FormattedMessage id="launch.details.name" defaultMessage="Program Name" />
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="programName"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder={formatMessage({ 
                id: 'launch.details.name.placeholder',
                defaultMessage: 'Enter your program name...'
              })}
              className={cn(!isNameValid && localName && 'border-destructive')}
            />
            {!isNameValid && localName && (
              <p className="text-sm text-destructive">
                <FormattedMessage 
                  id="launch.details.name.error" 
                  defaultMessage="Program name must be at least 3 characters" 
                />
              </p>
            )}
          </div>
          
          {/* Custom URL */}
          <div className="space-y-2">
            <Label htmlFor="customUrl">
              <FormattedMessage id="launch.details.url" defaultMessage="Custom URL" />
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-0 border rounded-md bg-muted/30 overflow-hidden">
                <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r truncate max-w-[50%]">
                  {baseUrl}
                </span>
                <Input
                  id="customUrl"
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="border-0 rounded-none focus-visible:ring-0"
                  placeholder="my-program"
                />
              </div>
              <div className="flex-shrink-0">
                {urlChecking ? (
                  <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : isUrlValid ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-destructive" />
                )}
              </div>
            </div>
            {!isUrlValid && localUrl && (
              <p className="text-sm text-destructive">
                <FormattedMessage 
                  id="launch.details.url.error" 
                  defaultMessage="URL must be at least 3 characters and available" 
                />
              </p>
            )}
          </div>
          
          {/* Duration - only for non-freemium */}
          {!isFreemium && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.details.startDate" defaultMessage="Start Date" />
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : (
                        <FormattedMessage id="common.selectDate" defaultMessage="Select date" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* End Date */}
              <div className="space-y-2">
                <Label>
                  <FormattedMessage id="launch.details.endDate" defaultMessage="End Date" />
                  <span className="text-muted-foreground text-sm ml-2">
                    (<FormattedMessage id="common.optional" defaultMessage="Optional" />)
                  </span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : (
                        <FormattedMessage id="common.selectDate" defaultMessage="Select date" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < (startDate || new Date())}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export { ProgramDetailsStep };
export default ProgramDetailsStep;
