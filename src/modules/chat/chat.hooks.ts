import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi, type SendMessageDto, type ChatMessage } from './chat.api';
import { toast } from 'sonner';

export const useChatConversation = (bookingId: string) => {
  return useQuery({
    queryKey: ['chat', bookingId],
    queryFn: () => chatApi.getConversation(bookingId),
    enabled: !!bookingId,
    refetchInterval: 10000, // Fallback poll every 10s
  });
};

export const useChatMessages = (bookingId: string, page = 1) => {
  return useQuery({
    queryKey: ['chat-messages', bookingId, page],
    queryFn: () => chatApi.getMessages(bookingId, page),
    enabled: !!bookingId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SendMessageDto) => chatApi.sendMessage(data),
    onSuccess: (newMessage) => {
      // Optimistically add message to cache
      queryClient.setQueryData(['chat', newMessage.bookingId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          messages: [...old.messages, newMessage],
        };
      });
      queryClient.invalidateQueries({ queryKey: ['chat', newMessage.bookingId] });
    },
    onError: () => toast.error('Failed to send message'),
  });
};
