
import type { Conversation, Notification } from './types';

export const conversations: Conversation[] = [
  {
    id: 'convo_1',
    partnerName: 'Anika Tabassum',
    partnerAvatar: 'https://placehold.co/128x128.png',
    lastMessage: 'Let me check and get back to you.',
    lastMessageTime: '5m',
    unreadCount: 1,
    messages: [
      { sender: 'other', text: `Hi there! Thanks for your willingness to donate. We can coordinate here.`, avatar: 'https://placehold.co/128x128.png', senderName: 'Anika Tabassum', time: '10:00 AM' },
      { sender: 'me', text: 'Hello! Happy to help. What is the best time and place?', avatar: 'https://placehold.co/128x128.png', senderName: 'Dip Kundu', time: '10:01 AM' },
      { sender: 'other', text: 'Just confirming I got your message. Let me check and get back to you.', avatar: 'https://placehold.co/128x128.png', senderName: 'Anika Tabassum', time: '10:02 AM' },
    ]
  },
  {
    id: 'convo_2',
    partnerName: 'Raihan Chowdhury',
    partnerAvatar: 'https://placehold.co/128x128.png',
    lastMessage: 'Great! See you then.',
    lastMessageTime: '3d',
    unreadCount: 0,
    messages: [
       { sender: 'other', text: `Hey, your offer was accepted! Thanks so much.`, avatar: 'https://placehold.co/128x128.png', senderName: 'Raihan Chowdhury', time: 'Yesterday' },
       { sender: 'me', text: 'Awesome! I can be at the hospital tomorrow at 2 PM.', avatar: 'https://placehold.co/128x128.png', senderName: 'Dip Kundu', time: 'Yesterday' },
       { sender: 'other', text: 'Great! See you then.', avatar: 'https://placehold.co/128x128.png', senderName: 'Raihan Chowdhury', time: 'Yesterday' },
    ]
  },
  {
    id: 'convo_3',
    partnerName: 'Admin Support',
    partnerAvatar: 'https://placehold.co/128x128.png',
    lastMessage: 'Your document has been verified.',
    lastMessageTime: '1w',
    unreadCount: 0,
    messages: [
       { sender: 'other', text: `Welcome to RoktoProbaho! Your document has been verified.`, avatar: 'https://placehold.co/128x128.png', senderName: 'Admin Support', time: '1w ago' },
    ]
  }
];

export const notifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'offer_accepted',
    text: 'Your donation offer to Raihan Chowdhury was accepted!',
    date: '1d',
    read: false,
    link: '/messages'
  },
  {
    id: 'notif_2',
    type: 'new_message',
    text: 'You have a new message from Anika Tabassum.',
    date: '2d',
    read: false,
    link: '/messages'
  },
  {
    id: 'notif_3',
    type: 'request_fulfilled',
    text: 'Your blood request for B- has been fulfilled by Anika Tabassum.',
    date: '3d',
    read: true,
    link: '/history'
  },
  {
    id: 'notif_4',
    type: 'welcome',
    text: 'Welcome to RoktoProbaho! Complete your profile to get started.',
    date: '1w',
    read: true,
    link: '/settings'
  },
];
