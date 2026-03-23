import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportApi, type CreateThreadDto } from './support.api';
import { toast } from 'sonner';

export const useSupportMyThreads = (page = 1) =>
  useQuery({
    queryKey: ['support-threads-mine', page],
    queryFn: () => supportApi.getMyThreads(page),
  });

export const useSupportAdminThreads = (page = 1, status?: string, category?: string) =>
  useQuery({
    queryKey: ['support-threads-admin', page, status, category],
    queryFn: () => supportApi.getAdminThreads(page, 20, status, category),
  });

export const useSupportThread = (threadId: string) =>
  useQuery({
    queryKey: ['support-thread', threadId],
    queryFn: () => supportApi.getThread(threadId),
    enabled: !!threadId,
  });

export const useSupportMessages = (threadId: string, page = 1) =>
  useQuery({
    queryKey: ['support-messages', threadId, page],
    queryFn: () => supportApi.getMessages(threadId, page),
    enabled: !!threadId,
    refetchInterval: 8000,
  });

export const useCreateSupportThread = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateThreadDto) => supportApi.createThread(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-threads-mine'] });
      toast.success('Support thread created');
    },
    onError: () => toast.error('Failed to create support thread'),
  });
};

export const useSendSupportMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, content }: { threadId: string; content: string }) =>
      supportApi.sendMessage(threadId, content),
    onSuccess: (msg) => {
      qc.invalidateQueries({ queryKey: ['support-messages', msg.threadId] });
    },
    onError: () => toast.error('Failed to send message'),
  });
};

export const useUpdateThreadStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ threadId, status }: { threadId: string; status: string }) =>
      supportApi.updateStatus(threadId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['support-threads-admin'] });
      toast.success('Thread status updated');
    },
  });
};
