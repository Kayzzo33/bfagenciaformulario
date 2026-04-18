import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { questions } from './data/questions';
import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendEmail } from './lib/resend';

const { Send, Check, ChevronRight, User, UserCheck, ArrowRight } = LucideIcons;

const Icon = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) return null;
  return <LucideIcon {...props} />;
};

const Typewriter = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const speed = text.length > 50 ? 4 : 7;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

const ChatBubble = ({ message, type }) => {
  const [isTypingComplete, setIsTypingComplete] = useState(type === 'user');

  return (
    <motion.div
      initial={{ opacity: 0, x: type === 'agency' ? -10 : 10, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      className={`message-bubble ${type === 'agency' ? 'message-agency' : 'message-user'}`}
    >
      {type === 'agency' && (
        <div className="avatar">
          <img src="/img/image.png" alt="Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
        </div>
      )}
      <div className="message-content">
        {type === 'agency' && !isTypingComplete ? (
          <Typewriter text={message} onComplete={() => setIsTypingComplete(true)} />
        ) : (
          message
        )}
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, x: -10, scale: 0.98 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    className="message-bubble message-agency typing-indicator"
  >
    <div className="avatar">
      <img src="/img/image.png" alt="Logo" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
    </div>
    <div className="message-content">
      <div className="dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </motion.div>
);

function App() {
  const [messages, setMessages] = useState([]);
  const [currentStepId, setCurrentStepId] = useState('welcome_1');
  const [userInput, setUserInput] = useState('');
  const [responses, setResponses] = useState({});
  const [multiSelect, setMultiSelect] = useState([]);
  const [isFlowing, setIsFlowing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const processedStepsRef = useRef(new Set());

  const messagesEndRef = useRef(null);
  const currentStep = questions.find(q => q.id === currentStepId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStepId, isFlowing, isTyping]);

  useEffect(() => {
    if (messages.length === 0 && !processedStepsRef.current.has('welcome_1')) {
      startStep('welcome_1');
    }
  }, []);

  const startStep = async (stepId) => {
    if (processedStepsRef.current.has(stepId)) return;

    const step = questions.find(q => q.id === stepId);
    if (!step) return;

    setIsFlowing(true);
    processedStepsRef.current.add(stepId);

    for (const msg of step.messages) {
      setIsTyping(true);
      
      // Calculate typing time based on message length for realism
      // Min 1s, Max 2.5s
      const typingTime = Math.min(Math.max(msg.length * 35, 1200), 2500);
      await new Promise(resolve => setTimeout(resolve, typingTime));
      
      setIsTyping(false);
      setMessages(prev => [...prev, { text: msg, type: 'agency', stepId }]);
      
      // Small breath between messages
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    setIsFlowing(false);

    if (step.type === 'text' && step.next) {
      setTimeout(() => startStep(step.next), 800);
    }

    setCurrentStepId(stepId);
  };

  const handleUserResponse = (value, label = null) => {
    if (isFlowing) return;

    const displayValue = label || value;
    setMessages(prev => [...prev, { text: displayValue, type: 'user' }]);

    const newResponses = { ...responses, [currentStep.field]: displayValue };
    setResponses(newResponses);

    // Conditional Logic for Investe Tráfego
    let nextStepId = currentStep.next;
    if (currentStepId === 'investe_trafego' && value === 'nunca_investi') {
      nextStepId = 'objetivo_foco';
    }

    // Branching for final investment decision
    if (currentStepId === 'decisao_investimento') {
      nextStepId = value === 'sim' ? 'conclusao_sim' : 'conclusao_nao';
    }

    if (nextStepId) {
      setTimeout(() => startStep(nextStepId), 600);
    }

    setUserInput('');
    setMultiSelect([]);
  };

  const handleWhatsAppRedirect = () => {
    const phone = '5573998170445';
    const text = Object.entries(responses)
      .map(([key, value]) => `*${key}:* ${value}`)
      .join('\n');
    
    const appUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(text)}`;
    const webUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;

    // Tenta abrir o App Desktop diretamente
    window.location.href = appUrl;

    // Fallback: Se o App não abrir em 1.5s (o browser continua com foco), abre a página web
    setTimeout(() => {
      if (document.hasFocus()) {
        window.open(webUrl, '_blank');
      }
    }, 1500);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // Dispara o redirecionamento do WhatsApp imediatamente ou após persistência
    // Vamos garantir que o e-mail e firebase sejam tentados primeiro, mas com timeout
    try {
      // 1. Save to Firebase (Rápido)
      await addDoc(collection(db, 'leads'), {
        ...responses,
        createdAt: serverTimestamp(),
      });

      // 2. Send Email (Pode falhar no localhost)
      try {
        await sendEmail(responses);
      } catch (e) {
        console.warn('Falha silenciosa no envio do e-mail:', e);
      }

      // 3. Redirecionar
      handleWhatsAppRedirect();
    } catch (error) {
      console.error('Erro na submissão:', error);
      // Mesmo com erro no Firebase, redirecionamos para não perder o usuário
      handleWhatsAppRedirect();
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (questions.findIndex(q => q.id === currentStepId) / (questions.length - 1)) * 100;

  return (
    <div className="chat-container">
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="messages-area">
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={`msg-${idx}`}
              message={msg.text}
              type={msg.type}
            />
          ))}

          {isTyping && <TypingIndicator />}

          {!isFlowing && currentStep && currentStep.type !== 'text' && (
            <motion.div
              key={`controls-${currentStepId}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-controls"
            >
              {currentStep.type === 'options' && (
                <div className="options-grid">
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.value}
                      className="btn-option"
                      onClick={() => handleUserResponse(opt.value, opt.label)}
                    >
                      {opt.icon && <div className="icon-container"><Icon name={opt.icon} size={18} /></div>}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {(currentStep.type === 'input' || currentStep.type === 'textarea') && (
                <div className="input-container-inline">
                  {currentStep.type === 'input' ? (
                    <input
                      type="text"
                      className="inline-input-field"
                      placeholder={currentStep.placeholder}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && userInput.trim() && handleUserResponse(userInput)}
                      autoFocus
                    />
                  ) : (
                    <textarea
                      className="inline-input-field"
                      rows={2}
                      placeholder={currentStep.placeholder}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      style={{ resize: 'none' }}
                      autoFocus
                    />
                  )}
                  <button
                    className="btn-send-inline"
                    disabled={!userInput.trim()}
                    onClick={() => handleUserResponse(userInput)}
                  >
                    <span>Enviar</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Final Redirect Button */}
          {['conclusao_sim', 'conclusao_nao'].includes(currentStepId) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="final-action-area"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px', paddingBottom: '40px' }}
            >
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`btn-whatsapp-final ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent)',
                  color: 'var(--bg-dark)',
                  fontWeight: 'bold',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {isSubmitting ? 'ENVIANDO...' : 'CONFIRMAR E FALAR COM UM CONSULTOR'}
                {!isSubmitting && <LucideIcons.MessageCircle size={22} style={{ marginLeft: '12px' }} />}
                {isSubmitting && <LucideIcons.Loader2 size={22} className="animate-spin" style={{ marginLeft: '12px' }} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default App;
