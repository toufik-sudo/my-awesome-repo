import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { getStoredJWT } from '@/utils/jwt';
import type { Notification } from './notifications.types';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8095';

interface BookingNotificationPayload {
  type: 'new_booking' | 'booking_accepted' | 'booking_declined' | 'booking_counter_offer' | 'new_chat_message';
  bookingId: string;
  propertyId?: string;
  propertyTitle?: string;
  guestName?: string;
  message?: string;
}

interface SupportNotificationPayload {
  threadId: string;
  message?: { content?: string; sender?: { id: number } };
}

interface NegativeReviewPayload {
  reviewId: string;
  propertyId: string;
  propertyTitle: string;
  rating: number;
  comment?: string;
}

export const useSocketNotifications = () => {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  const handleBookingEvent = useCallback((payload: BookingNotificationPayload) => {
    const notificationMap: Record<string, { title: string; message: string; actionUrl: string; type: Notification['type'] }> = {
      new_booking: {
        title: '🔔 New Booking Request',
        message: `${payload.guestName || 'A guest'} wants to book ${payload.propertyTitle || 'your property'}`,
        actionUrl: '/bookings/host',
        type: 'info',
      },
      booking_accepted: {
        title: '✅ Booking Accepted',
        message: `Your booking for ${payload.propertyTitle || 'a property'} has been accepted!`,
        actionUrl: `/chat/${payload.bookingId}`,
        type: 'success',
      },
      booking_declined: {
        title: '❌ Booking Declined',
        message: `Your booking for ${payload.propertyTitle || 'a property'} was declined. ${payload.message || ''}`,
        actionUrl: '/bookings',
        type: 'warning',
      },
      booking_counter_offer: {
        title: '💰 Counter-Offer Received',
        message: `The host sent a counter-offer for ${payload.propertyTitle || 'a property'}`,
        actionUrl: '/bookings',
        type: 'info',
      },
      new_chat_message: {
        title: '💬 New Message',
        message: `New message for booking at ${payload.propertyTitle || 'a property'}`,
        actionUrl: `/chat/${payload.bookingId}`,
        type: 'info',
      },
    };

    const config = notificationMap[payload.type];
    if (!config) return;

    const notification: Notification = {
      id: `${payload.type}-${payload.bookingId}-${Date.now()}`,
      title: config.title,
      message: config.message,
      timestamp: new Date().toISOString(),
      read: false,
      type: config.type,
      actionUrl: config.actionUrl,
      metadata: { bookingId: payload.bookingId, propertyId: payload.propertyId },
    };

    addNotification(notification);

    // Show toast with action
    toast(config.title, {
      description: config.message,
      action: {
        label: 'View',
        onClick: () => navigate(config.actionUrl),
      },
      duration: 8000,
    });
  }, [addNotification, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const token = getStoredJWT();
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected for notifications');
    });

    socket.on('booking:notification', handleBookingEvent);
    socket.on('chat:message', (payload: BookingNotificationPayload) => {
      handleBookingEvent({ ...payload, type: 'new_chat_message' });
    });

    // Support chat events
    socket.on('support:message', (payload: SupportNotificationPayload) => {
      const notification: Notification = {
        id: `support-msg-${payload.threadId}-${Date.now()}`,
        title: '💬 New Support Message',
        message: payload.message?.content?.substring(0, 80) || 'New message in your support thread',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'info',
        actionUrl: `/support/${payload.threadId}`,
      };
      addNotification(notification);
      toast('💬 New Support Message', {
        description: notification.message,
        action: { label: 'View', onClick: () => navigate(`/support/${payload.threadId}`) },
        duration: 6000,
      });
    });

    socket.on('support:new_thread', (payload: SupportNotificationPayload) => {
      const notification: Notification = {
        id: `support-new-${payload.threadId}-${Date.now()}`,
        title: '📩 New Support Request',
        message: 'A new support thread has been created',
        timestamp: new Date().toISOString(),
        read: false,
        type: 'info',
        actionUrl: `/support/${payload.threadId}`,
      };
      addNotification(notification);
      toast('📩 New Support Request', {
        description: notification.message,
        action: { label: 'View', onClick: () => navigate(`/support/${payload.threadId}`) },
        duration: 6000,
      });
    });

    // Negative review notification
    socket.on('review:negative', (payload: NegativeReviewPayload) => {
      const notification: Notification = {
        id: `neg-review-${payload.reviewId}-${Date.now()}`,
        title: '⚠️ Negative Review Received',
        message: `${payload.rating}-star review on "${payload.propertyTitle}": ${payload.comment || ''}`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'warning',
        actionUrl: `/support/review/${payload.reviewId}`,
        metadata: { reviewId: payload.reviewId, propertyId: payload.propertyId },
      };
      addNotification(notification);
      toast.warning('⚠️ Negative Review', {
        description: `${payload.rating}★ review on "${payload.propertyTitle}"`,
        action: { label: 'Respond', onClick: () => navigate(`/support/review/${payload.reviewId}`) },
        duration: 10000,
      });
    });

    socket.on('disconnect', (reason: string) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, handleBookingEvent]);

  return socketRef;
};
