import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import chatService from '../services/chatService';
import SocketContext from '../context/SocketContext';
import VehicleDetails from '../components/dashboard/VehicleDetails';
import QrPreview from '../components/dashboard/QrPreview';
import MessageList from '../components/dashboard/MessageList';
import ChatWindow from '../components/chat/ChatWindow';
import GlassCard from '../components/common/GlassCard';
import { MessageSquare, Layout, Sparkles } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const socket = useContext(SocketContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Read selected chat from query parameters
  useEffect(() => {
    const chatParam = searchParams.get('chat');
    if (chatParam) {
      setSelectedConversationId(chatParam);
    }
  }, [searchParams]);

  // Fetch initial conversations
  const fetchConversations = async () => {
    try {
      const response = await chatService.getConversations();
      if (response?.status === 'success') {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Listen to Socket.IO events for live conversation updates
  useEffect(() => {
    if (!socket) return;

    // Handle new message alert in conversation list
    const handleOwnerMessage = (data) => {
      const { conversationId, message } = data;
      
      setConversations((prev) => {
        const index = prev.findIndex((c) => c._id === conversationId);
        if (index === -1) {
          // If conversation is not in list, fetch conversations again
          fetchConversations();
          return prev;
        }
        
        const updated = [...prev];
        const conv = { ...updated[index] };
        conv.lastMessage = message.messageText;
        conv.lastMessageTime = message.createdAt;
        
        // Remove from current position and prepend to top
        updated.splice(index, 1);
        return [conv, ...updated];
      });
    };

    // Handle conversation creations
    const handleConversationCreated = (data) => {
      const { conversation, message } = data;
      setConversations((prev) => {
        // Double check if conversation already exists
        if (prev.some((c) => c._id === conversation._id)) return prev;
        return [conversation, ...prev];
      });
    };

    socket.on('message_received_owner', handleOwnerMessage);
    socket.on('conversation_created', handleConversationCreated);

    return () => {
      socket.off('message_received_owner', handleOwnerMessage);
      socket.off('conversation_created', handleConversationCreated);
    };
  }, [socket]);

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
    setSearchParams({ chat: id });
  };

  const getSelectedVisitorName = () => {
    const selected = conversations.find((c) => c._id === selectedConversationId);
    return selected ? selected.visitorName : 'Visitor';
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-slide-up">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 glass-panel">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            Welcome back, {user.fullName}
            <Sparkles className="h-5 w-5 text-brand-400 fill-brand-400/20" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor scans, print QRs, and securely message incidents reporters in real-time.
          </p>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Vehicle Info & QR (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <VehicleDetails />
          <QrPreview />
        </div>

        {/* Right Side: Conversations & Chat (8 Columns) */}
        <div className="lg:col-span-8 h-full">
          <GlassCard className="flex flex-col gap-6 h-[580px] p-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <span className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                <MessageSquare className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-lg text-white">Incident Inbox</h3>
                <p className="text-xs text-slate-500">Secure real-time chats with vehicle scanners</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
              {/* Left Column: Conversations List (5 Columns) */}
              <div className="md:col-span-5 flex flex-col min-h-0">
                <MessageList
                  conversations={conversations}
                  selectedId={selectedConversationId}
                  onSelectConversation={handleSelectConversation}
                  loading={loadingConversations}
                />
              </div>

              {/* Right Column: Chat Window (7 Columns) */}
              <div className="md:col-span-7 flex flex-col min-h-0 h-full">
                {selectedConversationId ? (
                  <ChatWindow
                    conversationId={selectedConversationId}
                    senderType="owner"
                    visitorName={getSelectedVisitorName()}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl p-6 bg-slate-950/10">
                    <MessageSquare className="h-10 w-10 text-slate-700 stroke-[1.5] mb-2" />
                    <span className="text-sm font-semibold text-slate-400">No Chat Selected</span>
                    <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Select an incident thread from the list to start messaging.</p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
