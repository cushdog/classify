"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem, CircularProgress, Fab, Slide } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, isUser: true }]);
      setInput('');
      setIsLoading(true);
  
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessages(prev => [...prev, { text: data.message, isUser: false }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, { text: "Sorry, I couldn't process your request.", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={toggleChat}
      >
        <ChatIcon />
      </Fab>
      <Slide direction="up" in={isChatOpen} mountOnEnter unmountOnExit>
        <Box sx={{ 
          position: 'fixed', 
          bottom: 80, 
          right: 16, 
          width: 350, 
          height: 500, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              <List>
                {messages.map((message, index) => (
                  <ListItem key={index} sx={{ justifyContent: message.isUser ? 'flex-end' : 'flex-start' }}>
                    <Paper elevation={1} sx={{ p: 1, bgcolor: message.isUser ? 'primary.light' : 'secondary.light' }}>
                      <Typography>{message.text}</Typography>
                    </Paper>
                  </ListItem>
                ))}
                {isLoading && (
                  <ListItem sx={{ justifyContent: 'flex-start' }}>
                    <CircularProgress size={20} />
                  </ListItem>
                )}
                <div ref={messagesEndRef} />
              </List>
            </Box>
            <Box sx={{ p: 2, display: 'flex' }}>
              <TextField 
                fullWidth 
                variant="outlined" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button variant="contained" onClick={handleSend} sx={{ ml: 1 }}>Send</Button>
            </Box>
          </Paper>
        </Box>
      </Slide>
    </>
  );
};

export default ChatBot;