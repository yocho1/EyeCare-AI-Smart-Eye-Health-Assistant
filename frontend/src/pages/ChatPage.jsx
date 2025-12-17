/**
 * Chat page for AI assistant interaction
 */
import { useState, useEffect, useRef } from 'react';
import { Disclaimer } from '../components/Disclaimer';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export function ChatPage() {
  const { request, loading, error } = useApi();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await request(apiService.getChatHistory());
        setHistory(data.reverse());
      } catch (err) {
        console.log('No chat history yet');
      }
    };
    fetchHistory();
  }, [request]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    // Add user message to UI
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date() },
    ]);

    try {
      const response = await request(
        apiService.sendMessage(userMessage, {
          time_of_day: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        })
      );

      // Add AI response to UI
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 p-4">
        <h1 className="text-3xl font-bold mb-2">💬 AI Eye-Care Assistant</h1>
        <Disclaimer />

        {/* Chat Messages */}
        <div className="bg-white rounded-lg shadow mb-4 h-96 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-lg mb-4">👋 Welcome! Ask me anything about eye health.</p>
              <p className="text-sm">
                I can help with screen habits, eye strain, reading comfort, and more.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block max-w-xs lg:max-w-md rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : msg.role === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div>
                      <p className="font-bold mb-2">Summary:</p>
                      <p className="mb-3">{msg.content.summary}</p>
                      <p className="font-bold mb-2">Tips:</p>
                      <ul className="list-disc list-inside mb-3">
                        {msg.content.tips.map((tip, i) => (
                          <li key={i} className="text-sm">
                            {tip}
                          </li>
                        ))}
                      </ul>
                      {msg.content.reminder && (
                        <p className="italic text-sm">💡 {msg.content.reminder}</p>
                      )}
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about eye health, screen habits, comfort..."
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded font-bold hover:bg-blue-600 disabled:bg-gray-300 transition"
            >
              {loading ? '⏳' : '📤'}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
