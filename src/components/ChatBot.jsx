import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Volume2, 
  VolumeX,
  AlertTriangle, 
  Activity, 
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { getAIResponse, flagChatSession } from '../utils/mockData';

export default function ChatBot({ user, setScreen }) {
  const [messages, setMessages] = useState([
    {
      id: "init-msg",
      sender: "bot",
      text: `Hello ${user.name}! I am MedBot, your AI health assistant. Feel free to type or speak your questions.\n\n*Please remember that I am an AI, not a doctor. I provide information, not medical diagnoses.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  
  const chatEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (textToSend) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim() || isLoading) return;

    const userMsg = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(messageText, user.profile);
      
      const botMsg = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: response.text,
        isEmergency: response.isEmergency,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);

      // Handle emergency escalation
      if (response.isEmergency) {
        setEmergencyAlert(response.text);
        // Save to admin logs
        flagChatSession(user.name, user.email, [...messages, userMsg, botMsg], response.reason);
      } else if (response.flagged) {
        // Flagged but not an emergency (e.g. general mental health trigger words)
        flagChatSession(user.name, user.email, [...messages, userMsg, botMsg], response.reason || "Flagged conversation keyword");
      }

      // Auto-read response if speech synthesis is enabled
      if (isSpeaking) {
        speakText(response.text.replace(/[*#]/g, '')); // Strip markdown
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        {
          id: "err-" + Date.now(),
          sender: "bot",
          text: "⚠️ Sorry, I had trouble connecting to my brain. Please try asking again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock speech-to-text
  const triggerVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    
    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsListening(false);
      const voicePrompts = [
        "What are some common symptoms of a food allergy?",
        "How can I manage a sudden, throbbing headache?",
        "I feel like I have a mild fever and a scratchy throat",
        "Should I go to the doctor for chest pain and shortness of breath?"
      ];
      // Pick a random one for high fidelity demo
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setInputValue(randomPrompt);
    }, 2000);
  };

  // Text to speech implementation
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Cancel active speak
    
    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="chat-window glass-panel" style={{ padding: '20px', position: 'relative' }}>
      
      {/* Top Disclaimer header */}
      {showDisclaimer && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          backgroundColor: 'rgba(91, 124, 250, 0.1)',
          borderBottom: '1px solid var(--border-glow)',
          borderRadius: '10px',
          marginBottom: '16px',
          fontSize: '12px',
          color: 'var(--text-body)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={14} color="var(--primary-blue)" />
            <span><strong>Medical Disclaimer:</strong> Advice offered by MedBot is for informational purposes only. In case of emergency, call services directly.</span>
          </div>
          <button 
            onClick={() => setShowDisclaimer(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '12px' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Message history logs */}
      <div className="chat-history">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'} ${msg.isEmergency ? 'emergency' : ''}`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {msg.text}
            <div style={{
              fontSize: '9px',
              color: 'var(--text-light)',
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              marginTop: '6px'
            }}>
              {msg.timestamp}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="chat-bubble bubble-bot" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
            <RefreshCw size={14} className="spin-animation" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span>MedBot is writing...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Emergency Alert Overlay Modal */}
      {emergencyAlert && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.9)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          borderRadius: '16px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '500px',
            padding: '32px',
            border: '2px solid var(--accent-error)',
            textAlign: 'center'
          }}>
            <AlertTriangle size={48} color="var(--accent-error)" style={{ marginBottom: '16px', display: 'inline' }} />
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Critical Safety Escalation</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-heading)', marginBottom: '24px', lineHeight: '1.6' }}>
              Your message indicated a potential medical emergency. For your safety, we recommend calling professional services immediately.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-danger" onClick={() => setScreen('emergency')}>
                <PhoneCall size={16} /> View Emergency Contacts
              </button>
              <button className="btn btn-secondary" onClick={() => setEmergencyAlert(null)}>
                Close Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat bottom input bar */}
      <div className="chat-input-bar">
        {/* Speak Output Toggle */}
        <button 
          onClick={() => speakText(messages[messages.length - 1]?.text.replace(/[*#]/g, ''))}
          className="btn btn-secondary"
          style={{ padding: '12px', borderRadius: '50%' }}
          title={isSpeaking ? "Stop Speaking" : "Read Last Response"}
        >
          {isSpeaking ? <VolumeX size={18} color="var(--accent-error)" /> : <Volume2 size={18} />}
        </button>

        {/* Speak Input Trigger */}
        <button 
          onClick={triggerVoiceInput}
          className="btn btn-secondary"
          style={{ 
            padding: '12px', 
            borderRadius: '50%',
            backgroundColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
            borderColor: isListening ? 'var(--accent-error)' : 'var(--border-subtle)'
          }}
          title="Speak Question"
        >
          <Mic size={18} className={isListening ? "pulse-animation" : ""} color={isListening ? "var(--accent-error)" : "currentColor"} />
        </button>

        <input 
          type="text"
          className="form-input"
          placeholder={isListening ? "Listening..." : "Type your health concern..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isListening}
          style={{ flexGrow: 1 }}
        />

        <button 
          onClick={() => handleSend()}
          className="btn btn-primary"
          style={{ padding: '12px', borderRadius: '50%' }}
          disabled={!inputValue.trim() || isLoading}
        >
          <Send size={18} />
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1.5s linear infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .pulse-animation {
          animation: pulse 1s infinite;
        }
      `}</style>
    </div>
  );
}
