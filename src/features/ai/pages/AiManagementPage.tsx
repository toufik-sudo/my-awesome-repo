// -----------------------------------------------------------------------------
// AI Management Page
// Combines personalization and RAG indexation management
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Database, Settings } from 'lucide-react';
import { AiPersonalizationForm } from '../components/AiPersonalizationForm';
import { AiRagIndexation } from '../components/AiRagIndexation';
import { useAiProfiles } from '../hooks/useAiProfiles';
import { useRagIndexation } from '../hooks/useRagIndexation';
import { getUserUuid } from '@/services/UserDataServices';

export const AiManagementPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const userUuid = getUserUuid() || '';

  const { profiles, adminPrograms, isLoading: profilesLoading, refresh: refreshProfiles } = useAiProfiles(userUuid);
  const ragIndexation = useRagIndexation(userUuid);

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          {formatMessage({ id: 'ai.management.title' }, { defaultMessage: 'AI Management' })}
        </h1>
        <p className="text-muted-foreground mt-2">
          {formatMessage({ id: 'ai.management.description' }, { defaultMessage: 'Configure AI profiles and manage knowledge base indexation' })}
        </p>
      </div>

      <Tabs defaultValue="personalization" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="personalization" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {formatMessage({ id: 'ai.tabs.personalization' }, { defaultMessage: 'Personalization' })}
          </TabsTrigger>
          <TabsTrigger value="indexation" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            {formatMessage({ id: 'ai.tabs.indexation' }, { defaultMessage: 'Indexation' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personalization">
          <AiPersonalizationForm
            userUuid={userUuid}
            profiles={profiles}
            onProfileSaved={refreshProfiles}
          />
        </TabsContent>

        <TabsContent value="indexation">
          <AiRagIndexation
            {...ragIndexation}
            adminPrograms={adminPrograms}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiManagementPage;
