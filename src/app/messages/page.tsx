
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import type { Conversation, ChatMessage } from '@/lib/types';
import { conversations as mockConversations } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MessagesPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConversation?.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !selectedConversation) return;

        const message: ChatMessage = { 
            sender: 'me', 
            text: newMessage, 
            avatar: user.avatarUrl, 
            senderName: user.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        const updatedConversation = {
            ...selectedConversation,
            messages: [...selectedConversation.messages, message],
            lastMessage: newMessage,
            lastMessageTime: 'Now',
        };

        const updatedConversations = conversations.map(c => 
            c.id === updatedConversation.id ? updatedConversation : c
        );

        setConversations(updatedConversations);
        setSelectedConversation(updatedConversation);
        setNewMessage('');
        
        // Mock reply
        setTimeout(() => {
            if (!user) return;
            const reply: ChatMessage = { sender: 'other', text: 'Thanks for your message. I will get back to you shortly.', avatar: selectedConversation.partnerAvatar, senderName: selectedConversation.partnerName, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })};
            const repliedConversation = {
                ...updatedConversation,
                messages: [...updatedConversation.messages, reply],
                lastMessage: reply.text,
            };
            const finalConversations = conversations.map(c => 
                c.id === repliedConversation.id ? repliedConversation : c
            );
            setConversations(finalConversations);
            setSelectedConversation(repliedConversation);
        }, 1500);
    };

    if (!user) {
        return <p>Loading...</p>;
    }
    
    const ChatView = () => (
        <div className="flex flex-col h-full">
            <header className="flex items-center gap-4 p-4 border-b">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                    <Icons.chevronRight className="h-5 w-5 rotate-180" />
                </Button>
                <Avatar>
                    <AvatarImage src={selectedConversation?.partnerAvatar} data-ai-hint="person portrait" />
                    <AvatarFallback>{selectedConversation?.partnerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{selectedConversation?.partnerName}</h3>
            </header>
            <ScrollArea className="flex-1 p-4 space-y-4">
                 {selectedConversation?.messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'other' && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.avatar} data-ai-hint="person portrait" />
                                <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`rounded-lg px-3 py-2 max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</p>
                        </div>
                         {msg.sender === 'me' && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.avatar} data-ai-hint="person portrait" />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </ScrollArea>
            <footer className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon">
                        <Icons.send className="h-4 w-4" />
                    </Button>
                </form>
            </footer>
        </div>
    );
    
    const ConversationList = () => (
        <div className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>{t('messages.title')}</CardTitle>
                <CardDescription>{t('messages.description')}</CardDescription>
            </CardHeader>
            <div className="p-4 border-b border-t">
                <Input placeholder={t('messages.searchPlaceholder')} />
            </div>
            <ScrollArea className="flex-1">
                 <CardContent className="p-0">
                    {conversations.map(convo => (
                        <div key={convo.id} 
                            onClick={() => setSelectedConversation(convo)} 
                            className={cn(
                                "flex items-start gap-4 p-4 cursor-pointer border-b hover:bg-muted/50",
                                selectedConversation?.id === convo.id && "bg-muted"
                            )}>
                            <Avatar>
                                <AvatarImage src={convo.partnerAvatar} data-ai-hint="person portrait" />
                                <AvatarFallback>{convo.partnerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold truncate">{convo.partnerName}</h4>
                                    <p className="text-xs text-muted-foreground flex-shrink-0">{convo.lastMessageTime}</p>
                                </div>
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                    {convo.unreadCount > 0 && <Badge className="w-5 h-5 p-0 flex items-center justify-center">{convo.unreadCount}</Badge>}
                                </div>
                            </div>
                        </div>
                    ))}
                 </CardContent>
            </ScrollArea>
        </div>
    );

  return (
    <div className="container mx-auto py-10 px-4">
        <div className="md:hidden">
            <Card className="h-[calc(100vh-10rem)]">
              {!selectedConversation ? <ConversationList /> : <ChatView />}
            </Card>
        </div>
        <div className="hidden md:block">
             <Card className="h-[calc(100vh-12rem)] md:grid md:grid-cols-12 overflow-hidden">
                 <div className="col-span-4 border-r">
                    <ConversationList />
                 </div>
                 <div className="col-span-8">
                    {selectedConversation ? (
                        <ChatView />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Select a conversation to start chatting.</p>
                        </div>
                    )}
                 </div>
            </Card>
        </div>
    </div>
  );
}
