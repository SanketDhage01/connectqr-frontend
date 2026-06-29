import React, { useState, useEffect, useRef, useContext } from 'react';
import chatService from '../../services/chatService';
import SocketContext from '../../context/SocketContext';
import TypingIndicator from './TypingIndicator';
import { Send, Image, AlertTriangle } from 'lucide-react';

export const ChatWindow = ({
  conversationId,
  senderType = 'owner', // 'owner' or 'visitor'
  visitorName = 'Visitor'
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const socket = useContext(SocketContext);
  const messagesEndRef = useRef(null);
  
  const serverBaseUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await chatService.getMessages(conversationId);
        if (response?.status === 'success') {
          setMessages(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve message logs');
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    if (conversationId) {
      fetchHistory();
    }
  }, [conversationId]);

  // 2. Establish Socket Connection and Events
  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join conversation room
    socket.emit('join_conversation', conversationId);

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      setOtherUserTyping(false);
      setTimeout(scrollToBottom, 50);
    };

    // Listen for typing events
    const handleTyping = (data) => {
      if (data.senderType !== senderType) {
        setOtherUserTyping(true);
        setTimeout(scrollToBottom, 50);
      }
    };

    const handleStopTyping = (data) => {
      if (data.senderType !== senderType) {
        setOtherUserTyping(false);
      }
    };

    socket.on('message_received', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('message_received', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket, conversationId, senderType]);

  // 3. Handle message submit
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const payload = {
      messageText: inputText,
      senderType
    };

    try {
      setInputText('');
      
      // Stop typing socket notification
      if (socket) {
        socket.emit('stop_typing', { conversationId, senderType });
        setIsTyping(false);
      }

      await chatService.sendReply(conversationId, payload);
      // Note: Message is appended via the socket event handleNewMessage
    } catch (err) {
      setError('Message delivery failed');
    }
  };

  // 4. Handle input changes and Typing indicator
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        conversationId,
        senderType,
        senderName: senderType === 'owner' ? 'Owner' : visitorName
      });
    }

    if (typingTimer) clearTimeout(typingTimer);

    setTypingTimer(
      setTimeout(() => {
        socket.emit('stop_typing', { conversationId, senderType });
        setIsTyping(false);
      }, 2000)
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-16 text-slate-500 gap-3">
        <svg className="animate-spin h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs">Connecting to secure tunnel...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950/20 rounded-2xl border border-slate-900 overflow-hidden h-[500px]">
      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-xs text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        {messages.map((m) => {
          const isMe = m.senderType === senderType;
          
          return (
            <div
              key={m._id}
              className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
            >
              {/* Sender Name tag */}
              <span className="text-[10px] text-slate-500 font-semibold px-1 py-0.5">
                {isMe ? 'You' : m.senderName}
              </span>

              {/* Message Bubble */}
              <div
                className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Reason header for initial message */}
                {m.reason && (
                  <span className="block font-bold text-[10px] uppercase tracking-wider text-brand-300 mb-1.5 border-b border-brand-500/25 pb-1">
                    {m.reason}
                  </span>
                )}
                
                {/* Main message text */}
                <p className="whitespace-pre-wrap">{m.messageText}</p>

                {/* Optional Image attachment preview */}
                {m.imageAttachment && (
                  <div className="mt-2.5 rounded-lg overflow-hidden border border-black/10 max-w-xs aspect-video">
                    <img
                      src={`${serverBaseUrl}${m.imageAttachment}`}
                      alt="Attachment alert"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
              </div>
              
              <span className="text-[9px] text-slate-500/80 mt-1 px-1">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Dynamic Typing indicator */}
        {otherUserTyping && (
          <div className="self-start">
            <TypingIndicator visitorName={senderType === 'owner' ? visitorName : 'Owner'} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply input tray */}
      <form onSubmit={handleSend} className="bg-slate-950/80 border-t border-slate-900 p-3 flex gap-2.5 items-center">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type a secure message..."
          className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-md shadow-brand-600/10"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
export default ChatWindow;
