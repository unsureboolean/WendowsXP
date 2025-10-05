import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { personas } from '../../data/personas';
import { getIcon } from '../../assets/icons';
import type { IconType } from '../../assets/icons';

interface Message {
  author: string;
  text: string;
  avatar: IconType;
}

export const PersonaZoo: React.FC = () => {
  const [ai] = useState(() => new GoogleGenAI({apiKey: process.env.AIzaSyCuRN4y1Y-vDwJgJpVL475LH6THDZluqSM}));
  const [personaOrder, setPersonaOrder] = useState<string[]>(() => Object.keys(personas));
  const [activePersonaKey, setActivePersonaKey] = useState<string>('zookeeper');
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const chatSessions = useRef<Record<string, Chat>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activePersonaKey]);

  useEffect(() => {
    const initializeZookeeper = () => {
      if (!conversations.zookeeper) {
        const persona = personas.zookeeper;
        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction: persona.system_prompt }
        });
        chatSessions.current.zookeeper = chat;

        const greeting = "Welcome to PersonaZoo! I'm the Zookeeper. You can chat with different characters by selecting them from the sidebar. Who would you like to talk to first?";
        
        const welcomeMessage: Message = {
          author: persona.nickname,
          text: greeting,
          avatar: persona.avatar as IconType || 'app',
        };

        setConversations(prev => ({ ...prev, zookeeper: [welcomeMessage] }));
      }
    };
    initializeZookeeper();
  }, [ai]);

  const handlePersonaSelect = async (key: string) => {
    if (key === activePersonaKey) return;

    setActivePersonaKey(key);
    setPersonaOrder(prev => [key, ...prev.filter(p => p !== key)]);

    if (!conversations[key]) {
      setIsLoading(prev => ({ ...prev, [key]: true }));

      const persona = personas[key];
      const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: persona.system_prompt }
      });
      chatSessions.current[key] = chat;

      try {
        const response = await chat.sendMessage({ message: "Introduce yourself to me in character with a short greeting." });
        const initialMessage: Message = {
          author: persona.nickname,
          text: response.text,
          avatar: persona.avatar as IconType || 'app',
        };
        setConversations(prev => ({ ...prev, [key]: [initialMessage] }));
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        const errorMessage: Message = {
          author: 'System',
          text: 'Could not contact this persona. They might be busy.',
          avatar: 'app',
        };
        setConversations(prev => ({ ...prev, [key]: [errorMessage] }));
      } finally {
        setIsLoading(prev => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const key = activePersonaKey;
    const currentChat = chatSessions.current[key];
    if (!userInput.trim() || isLoading[key] || !currentChat) return;
    
    const userMessage: Message = { author: 'You', text: userInput, avatar: 'computer' };
    const currentInput = userInput;
    
    setUserInput('');
    setConversations(prev => ({ ...prev, [key]: [...(prev[key] || []), userMessage] }));
    setIsLoading(prev => ({ ...prev, [key]: true }));
    setPersonaOrder(prev => [key, ...prev.filter(p => p !== key)]);

    try {
      const response = await currentChat.sendMessage({ message: currentInput });
      const persona = personas[key];
      const aiMessage: Message = {
        author: persona.nickname,
        text: response.text,
        avatar: persona.avatar as IconType || 'app',
      };
      setConversations(prev => ({ ...prev, [key]: [...(prev[key] || []), aiMessage] }));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        author: 'System',
        text: 'Sorry, something went wrong. Please check your connection.',
        avatar: 'app',
      };
      setConversations(prev => ({ ...prev, [key]: [...(prev[key] || []), errorMessage] }));
    } finally {
      setIsLoading(prev => ({ ...prev, [key]: false }));
    }
  };
  
  const currentMessages = conversations[activePersonaKey] || [];
  const currentPersona = personas[activePersonaKey];

  return (
    <div className="w-full h-full flex flex-row bg-white font-sans text-sm">
      {/* Sidebar */}
      <div className="w-[160px] h-full bg-white border-r-2 border-gray-300 flex flex-col overflow-y-auto">
        {personaOrder.map(key => {
          const persona = personas[key];
          const isActive = key === activePersonaKey;
          const Avatar = getIcon(persona.avatar as IconType || 'app');
          return (
            <button
              key={key}
              onClick={() => handlePersonaSelect(key)}
              className={`w-full flex items-center p-2.5 text-left border-b border-gray-200 ${
                isActive ? 'bg-[#3b82f6] text-white' : 'bg-white text-black hover:bg-gray-100'
              } transition-colors duration-150 focus:outline-none`}
            >
              <Avatar className="w-6 h-6 mr-2 flex-shrink-0" />
              <span className="truncate font-semibold">{persona.nickname}</span>
            </button>
          )
        })}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-2 border-b-2 bg-gray-100 shadow-sm">
            <p className="font-bold text-base text-gray-800">Chat with {currentPersona.nickname}</p>
        </div>
        <div className="flex-grow p-3 overflow-y-auto bg-[#f0f0f0]">
          {currentMessages.map((msg, index) => {
            const MsgAvatar = getIcon(msg.avatar);
            return (
              <div key={index} className={`flex items-start mb-3 ${msg.author === 'You' ? 'justify-end' : ''}`}>
                 {msg.author !== 'You' && <MsgAvatar className="w-8 h-8 mr-2 rounded-full bg-gray-300 p-1 flex-shrink-0" />}
                 <div className={`p-2.5 rounded-lg max-w-[75%] shadow-sm ${msg.author === 'You' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                   <p className="font-bold mb-0.5">{msg.author}</p>
                   <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                 </div>
                 {msg.author === 'You' && <MsgAvatar className="w-8 h-8 ml-2 rounded-full bg-gray-300 p-1 flex-shrink-0" />}
              </div>
            );
          })}
          {isLoading[activePersonaKey] && (
             <div className="flex items-start mb-2">
               <div className="p-2 rounded-lg max-w-[70%] bg-white text-black shadow-sm">
                 <p className="font-bold">{currentPersona.nickname}</p>
                 <p className="italic text-gray-500">typing...</p>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-2 border-t bg-gray-100 flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={`Message ${currentPersona.nickname}...`}
            className="flex-grow border-gray-300 border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!isLoading[activePersonaKey]}
            aria-label="Chat input"
          />
          <button type="submit" className="bg-blue-500 text-white px-5 py-2 rounded-r-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-150" disabled={!!isLoading[activePersonaKey] || !userInput.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};