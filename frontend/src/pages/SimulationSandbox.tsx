import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { submitSimulation } from '../services/api';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const SimulationSandbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Welcome to the Synapse Simulation Sandbox! I can help you explore "what-if" scenarios for your supply chain. Try asking me about delays, capacity changes, weather events, or any other operational challenges.',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await submitSimulation(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get simulation response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What if a major supplier is delayed by 24 hours?",
    "How would a 30% increase in demand affect our operations?",
    "What's the impact of severe weather on our Northeast routes?",
    "How should we handle a warehouse capacity shortage?",
  ];

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Simulation Sandbox</h1>
        <p className="text-gray-400">AI-powered scenario planning and decision support</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-dark-800/50 backdrop-blur-xl rounded-xl border border-primary-400/20 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-4xl ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-primary-400 text-dark-900' 
                      : 'bg-gradient-to-br from-secondary-500 to-accent-500 text-white'
                  }`}>
                    {message.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-primary-400 text-dark-900'
                        : 'bg-dark-700/70 text-white border border-gray-600/20'
                    }`}>
                      {message.type === 'ai' ? (
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              h1: ({children}) => <h1 className="text-xl font-bold text-primary-400 mb-3">{children}</h1>,
                              h2: ({children}) => <h2 className="text-lg font-semibold text-white mb-2">{children}</h2>,
                              h3: ({children}) => <h3 className="text-base font-medium text-gray-200 mb-2">{children}</h3>,
                              p: ({children}) => <p className="text-gray-300 mb-2 leading-relaxed">{children}</p>,
                              ul: ({children}) => <ul className="list-disc list-inside text-gray-300 mb-2 space-y-1">{children}</ul>,
                              li: ({children}) => <li className="text-gray-300">{children}</li>,
                              strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                              code: ({children}) => <code className="bg-dark-800 px-2 py-1 rounded text-primary-400">{children}</code>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                    <div className={`text-xs text-gray-400 mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-4xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-secondary-500 to-accent-500 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-dark-700/70 p-4 rounded-2xl border border-gray-600/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">Analyzing scenario...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 border-t border-gray-600/20"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Try these scenarios:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSuggestionClick(question)}
                  className="text-left p-3 bg-dark-700/50 hover:bg-dark-700 border border-gray-600/20 hover:border-primary-400/30 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-600/20">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe a scenario you'd like to explore..."
                disabled={isLoading}
                className="w-full px-4 py-3 bg-dark-700/50 border border-gray-600/20 rounded-lg text-white focus:outline-none focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/20 disabled:opacity-50"
              />
            </div>
            <motion.button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-primary-400 text-dark-900 rounded-lg font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SimulationSandbox;