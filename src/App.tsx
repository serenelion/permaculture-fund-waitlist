import React, { useState, useEffect, useRef } from 'react';
import { Send, Leaf, Sprout, Coins } from 'lucide-react';

type Message = {
  text: string;
  sender: 'bot' | 'user';
};

type UserInfo = {
  email: string;
  interestedIn: 'investing' | 'farming' | null;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: '', interestedIn: null });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showButtons, setShowButtons] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "Welcome to permaculture.fund! We're an exciting new idea for a Web3 quadratic funding platform for sustainable agriculture. We're currently growing our waitlist. Are you interested in joining as an investor or a farmer?",
    "Great! Could you please share your email address so we can add you to our waitlist and keep you updated on our progress?",
    "Thanks for joining our waitlist! What aspects of permaculture or sustainable agriculture are you most passionate about?",
    "That's fascinating! How do you think Web3 technology can enhance funding for sustainable agriculture projects?",
    "Excellent insights! Is there anything specific you'd like to know about our vision for permaculture.fund or our approach to quadratic funding?"
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ text: questions[0], sender: 'bot' }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    setMessages(prev => [...prev, { text, sender }]);
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    switch (currentQuestion) {
      case 0:
        if (lowerInput.includes('invest')) {
          setUserInfo(prev => ({ ...prev, interestedIn: 'investing' }));
        } else if (lowerInput.includes('farm')) {
          setUserInfo(prev => ({ ...prev, interestedIn: 'farming' }));
        } else {
          addMessage("I'm not sure I understood. Could you please clarify if you're interested in investing or farming?", 'bot');
          return;
        }
        break;
      case 1:
        if (lowerInput.includes('@') && lowerInput.includes('.')) {
          setUserInfo(prev => ({ ...prev, email: input }));
        } else {
          addMessage("That doesn't look like a valid email address. Could you please try again?", 'bot');
          return;
        }
        break;
    }

    setCurrentQuestion(prev => prev + 1);
    addMessage(questions[currentQuestion + 1], 'bot');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    addMessage(input, 'user');
    setInput('');

    setTimeout(() => {
      processUserInput(input);
    }, 500);
  };

  const handleButtonClick = (type: 'investing' | 'farming') => {
    setUserInfo(prev => ({ ...prev, interestedIn: type }));
    setShowButtons(false);
    addMessage(type === 'investing' ? "I'm interested in investing" : "I'm interested in farming", 'user');
    setTimeout(() => {
      setCurrentQuestion(1);
      addMessage(questions[1], 'bot');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-green-600 p-4 flex items-center">
          <Leaf className="text-white w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">permaculture.fund</h1>
        </div>
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {message.text}
              </div>
            </div>
          ))}
          {showButtons && (
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => handleButtonClick('investing')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              >
                <Coins className="w-5 h-5 mr-2" />
                Investor
              </button>
              <button
                onClick={() => handleButtonClick('farming')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
              >
                <Sprout className="w-5 h-5 mr-2" />
                Farmer
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Join our waitlist for the future of sustainable agriculture funding</p>
        <p className="mt-1">Earth Care • People Care • Fair Share</p>
      </div>
    </div>
  );
}

export default App;