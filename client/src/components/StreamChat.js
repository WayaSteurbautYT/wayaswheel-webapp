import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ChatContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  bottom: 20px;
  width: 300px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid #ff0000;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
  pointer-events: none;
`;

const ChatHeader = styled.div`
  background: #ff0000;
  color: white;
  padding: 10px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  text-align: center;
  letter-spacing: 1px;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ff0000;
  }
`;

const Message = styled(motion.div)`
  font-size: 0.9rem;
  color: white;
  line-height: 1.4;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 8px;
  border-radius: 5px;
`;

const Username = styled.span`
  font-weight: bold;
  color: #ff4444;
  margin-right: 6px;
`;

const VoteBadge = styled.span`
  background: #ff0000;
  color: white;
  font-size: 0.7rem;
  padding: 2px 4px;
  border-radius: 3px;
  margin-left: 5px;
  font-weight: bold;
`;

const StreamChat = ({ onVote }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const botNames = ['DoomSlayer', 'ChaosChaos', 'WayaFan_1', 'GamerGod', 'RegretMaster', 'VoidWalker', 'StreamSlayer', 'MemeLord'];
  const votePhrases = ['!doom high', '!doom low', '!doom extreme', '!question chaos', '!vote regret'];
  const randomPhrases = ['LUL', 'OMEGALUL', 'POGGERS', 'RIP user', 'THE DOOM IS REAL', 'Screaming right now!', 'WayaCreate is goated'];

  useEffect(() => {
    const interval = setInterval(() => {
      const name = botNames[Math.floor(Math.random() * botNames.length)];
      const isVote = Math.random() > 0.7;
      let text = '';

      if (isVote) {
        text = votePhrases[Math.floor(Math.random() * votePhrases.length)];
        // Simulate a vote action
        if (onVote) {
          const voteType = text.includes('high') ? 'high' : text.includes('low') ? 'low' : 'extreme';
          onVote(voteType);
        }
      } else {
        text = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];
      }

      setMessages(prev => [...prev.slice(-50), { id: Date.now(), name, text, isVote }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [onVote]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatContainer>
      <ChatHeader>🔴 LIVE CHAT</ChatHeader>
      <MessageList ref={scrollRef}>
        {messages.map(msg => (
          <Message 
            key={msg.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Username>{msg.name}:</Username>
            <span>{msg.text}</span>
            {msg.isVote && <VoteBadge>VOTE</VoteBadge>}
          </Message>
        ))}
      </MessageList>
    </ChatContainer>
  );
};

export default StreamChat;