'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot } from 'lucide-react';

const questions = [
  { key: 'customerName', query: "To start, what is the customer's full name?" },
  { key: 'email', query: "Great! What's their email address?" },
  { key: 'phone', query: "And their phone number?" },
  { key: 'billingAddress', query: "What's the billing address for this invoice?" },
  { key: 'shippingAddress', query: "Is the shipping address the same as the billing address? (Yes/No)" },
  // Conditional question for shipping address
  { key: 'finalConfirmation', query: "Perfect! All details collected. Ready to generate the invoice?" }
];

type Message = {
  sender: 'bot' | 'user';
  text: string;
};

export function CustomerChat() {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: questions[0].query }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentQuestion = questions[step];
    const newMessages: Message[] = [...messages, { sender: 'user', text: inputValue }];
    const newAnswers = { ...answers, [currentQuestion.key]: inputValue };
    setAnswers(newAnswers);
    
    let nextStep = step + 1;
    
    // Conditional logic for shipping address
    if (currentQuestion.key === 'shippingAddress') {
      if (inputValue.trim().toLowerCase() === 'no') {
        newMessages.push({ sender: 'bot', text: 'Please provide the shipping address.' });
        questions.splice(step + 1, 0, { key: 'customShippingAddress', query: 'Understood. What is the shipping address?' });
      } else {
        newAnswers.shippingAddress = newAnswers.billingAddress;
      }
    }

    if (nextStep < questions.length) {
      newMessages.push({ sender: 'bot', text: questions[nextStep].query });
    }
    
    setMessages(newMessages);
    setStep(nextStep);
    setInputValue('');
  };
  
  const isFinished = step >= questions.length;

  return (
    <div className="flex flex-col h-[70vh] rounded-lg border bg-card">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 border border-accent">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
               {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        {isFinished ? (
           <div className="flex items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground">Invoice details collected.</p>
            <Button className="bg-accent hover:bg-accent/90">Generate Invoice</Button>
            </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer..."
              autoComplete="off"
              disabled={isFinished}
            />
            <Button type="submit" size="icon" disabled={isFinished} className="bg-accent hover:bg-accent/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
