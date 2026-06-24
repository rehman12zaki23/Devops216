import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingBag,
  Package,
  Truck,
  CreditCard,
  ArrowDown,
  Minimize2,
  Maximize2,
  Star,
  Heart,
  Gift,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI shopping assistant! 🛍️ I can help you with orders, products, returns, and more. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

  // Get user data from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userOrders } = useSelector((state) => state.orderProduct);

  const quickActions = [
    { text: "Track my order", icon: Package, category: "order" },
    { text: "Return policy", icon: ArrowDown, category: "return" },
    { text: "Payment help", icon: CreditCard, category: "payment" },
    { text: "Product recommendations", icon: Star, category: "product" },
    { text: "Size guide", icon: Users, category: "size" },
    { text: "Shipping info", icon: Truck, category: "shipping" }
  ];

  const botResponses = {
    greeting: [
      `Hello${userName ? ` ${userName}` : ''}! Welcome to our store! How can I assist you today? 😊`,
      `Hi there${userName ? ` ${userName}` : ''}! I'm here to help you with your shopping needs! 🛍️`,
      `Welcome back${userName ? ` ${userName}` : ''}! What can I help you find today? ✨`
    ],
    order: [
      isAuthenticated ? 
        `I can see you have ${userOrders?.length || 0} orders. Let me help you track them! You can also check your dashboard for detailed tracking.` :
        "I'd be happy to help you track your order! Please log in to your account to see your order history, or provide your order ID.",
      "To track your order, you can go to 'My Dashboard' in your account or provide me with your order number. I'll check the status for you! 📦",
      "Sure! You can find order tracking in your user dashboard. Is there a specific order you'd like to check? 🔍"
    ],
    payment: [
      "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and digital wallets. All payments are secured with 256-bit SSL encryption! 🔒",
      "Having payment issues? Please check if your card details are correct or try a different payment method. Our support team is here to help! 💳",
      "Our payment system is completely secure and supports multiple payment options. Need help with a specific payment issue? 💰"
    ],
    return: [
      "Our hassle-free return policy allows returns within 30 days of purchase. Items must be in original condition with tags attached! 📝",
      "Returns are super easy! Just go to your order history and click 'Return Item'. We'll send you a prepaid return label! 📮",
      "We offer free returns on most items! Need to return something? I can guide you through the simple process! ↩️"
    ],
    product: [
      "I'd love to help you find the perfect products! We have amazing collections in Men's, Women's, Kids, Accessories, and Footwear. What are you shopping for? 👕",
      "Looking for product recommendations? Tell me your style preferences and I'll suggest some great items! Our bestsellers are always popular! ⭐",
      "Browse our latest collections! New arrivals, trending items, or something specific? I can help you discover amazing products! 🆕"
    ],
    shipping: [
      "🚚 FREE shipping on orders over $50! 📦 Standard delivery: 3-5 business days ⚡ Express: 1-2 days 🚀 Next day delivery available!",
      "Your order ships within 24 hours! You'll get tracking info via email and SMS. We use eco-friendly packaging too! 🌱",
      "Shipping options: Standard (FREE over $50), Express ($9.99), Next Day ($19.99). International shipping available to 50+ countries! 🌍"
    ],
    size: [
      "Check our detailed size guide on each product page! We have size charts with measurements in inches and centimeters. Need help with a specific item? 📏",
      "Unsure about sizing? Each product has customer reviews with fit feedback! Plus we offer easy exchanges if needed! 👗",
      "Our size guide includes bust, waist, hip measurements for clothing and length/width for shoes. What item are you sizing? 👔"
    ],
    recommendation: [
      "Based on popular choices, I recommend checking out our bestsellers! Customer favorites include our premium basics and seasonal collections! ⭐",
      "What's your style? Casual, formal, sporty? I can suggest perfect items based on your preferences and current trends! 💫",
      "Our AI picks trending items just for you! Popular right now: sustainable fashion, comfort wear, and statement accessories! 🔥"
    ],
    account: [
      isAuthenticated ? 
        `Welcome ${user?.userName || 'valued customer'}! Your account is active. You can manage orders, wishlists, and preferences in your dashboard! ✨` :
        "Create an account for exclusive perks! Track orders, save wishlists, get personalized recommendations, and enjoy member-only deals! 🎁",
      "Account benefits: Order tracking, exclusive sales, birthday discounts, loyalty points, and faster checkout! Join our community! 👥",
      "Having account issues? I can help with login problems, password resets, or account settings. What do you need assistance with? 🔧"
    ],
    default: [
      "I'm your smart shopping assistant! I can help with orders, products, payments, returns, sizing, and recommendations. What would you like to know? 🤖",
      "Great question! I'm here to make your shopping experience amazing. Can you tell me more about what you're looking for? 💭",
      "I'd love to help! I can assist with: 📦 Orders, 🛍️ Products, 💳 Payments, ↩️ Returns, 📏 Sizing, and ⭐ Recommendations. What interests you?",
      "Not sure what you need? Try asking about our products, checking your orders, or learning about our policies. I'm here to help! 😊"
    ]
  };

  useEffect(() => {
    if (user?.userName) {
      setUserName(user.userName);
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Greeting detection
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good')) {
      return getRandomResponse(botResponses.greeting);
    }
    // Order related
    else if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('status') || lowerMessage.includes('delivery')) {
      return getRandomResponse(botResponses.order);
    }
    // Payment related
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card') || lowerMessage.includes('checkout')) {
      return getRandomResponse(botResponses.payment);
    }
    // Return related
    else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange') || lowerMessage.includes('cancel')) {
      return getRandomResponse(botResponses.return);
    }
    // Product related
    else if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('buy') || lowerMessage.includes('shop') || lowerMessage.includes('browse')) {
      return getRandomResponse(botResponses.product);
    }
    // Recommendation related
    else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('popular') || lowerMessage.includes('best') || lowerMessage.includes('trending')) {
      return getRandomResponse(botResponses.recommendation);
    }
    // Shipping related
    else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery') || lowerMessage.includes('ship') || lowerMessage.includes('free')) {
      return getRandomResponse(botResponses.shipping);
    }
    // Size related
    else if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('measurement') || lowerMessage.includes('large') || lowerMessage.includes('small')) {
      return getRandomResponse(botResponses.size);
    }
    // Account related
    else if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('register') || lowerMessage.includes('profile')) {
      return getRandomResponse(botResponses.account);
    }
    // Default responses
    else {
      return getRandomResponse(botResponses.default);
    }
  };

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate realistic typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getResponse(message),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // Random delay between 1.2-2 seconds
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Chat cleared! How can I help you today? 😊",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
            {/* Floating animation dots */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'h-16 w-80' : 'h-[600px] w-80'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold">AI Shopping Assistant</h3>
                <p className="text-xs text-purple-100 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                        : 'bg-white border-2 border-purple-100 shadow-sm'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-purple-500" />
                      )}
                    </div>
                    <div className={`max-w-[220px] ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-3 rounded-2xl shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md'
                          : 'bg-white border border-gray-200 rounded-bl-md text-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="p-2 rounded-full bg-white border-2 border-purple-100 shadow-sm">
                      <Bot className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-gray-600 font-medium">Quick Actions:</p>
                  <button 
                    onClick={clearChat}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Clear Chat
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      className="flex items-center space-x-2 p-2 text-left text-xs bg-white hover:bg-purple-50 rounded-lg transition-all duration-200 border border-gray-100 hover:border-purple-200 hover:shadow-sm"
                    >
                      <action.icon className="h-3 w-3 text-purple-500" />
                      <span className="text-gray-700 font-medium">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI Assistant • Always here to help 24/7 🤖✨
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Chatbot;
