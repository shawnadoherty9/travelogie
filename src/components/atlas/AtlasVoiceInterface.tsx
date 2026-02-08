import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Mic, MicOff, Volume2, VolumeX, Send, MessageSquare } from 'lucide-react';

interface AtlasVoiceInterfaceProps {
  isEnabled: boolean;
  onToggle: () => void;
}

const AtlasVoiceInterface: React.FC<AtlasVoiceInterfaceProps> = ({ isEnabled, onToggle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'atlas', content: string}>>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Web Speech API for voice input
  const { 
    transcript, 
    isListening, 
    isSupported: speechSupported,
    startListening, 
    stopListening,
    resetTranscript 
  } = useSpeechRecognition();

  // Update message when speech is recognized
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  // Auto-send when speech recognition stops with a transcript
  useEffect(() => {
    if (!isListening && transcript && message === transcript) {
      handleSendMessage();
      resetTranscript();
    }
  }, [isListening, transcript]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const navigationResponses = {
    home: "Welcome to Travelogie! I'm Atlas, your cultural travel guide. From here you can explore destinations, book personalized tours, or connect with local guides.",
    destinations: "Our destinations page showcases amazing places around the world. You can explore cities like Tokyo, Barcelona, Paris, and more to discover authentic cultural experiences.",
    tours: "The tours section lets you book personalized experiences with local guides. You can choose from cultural experiences, language lessons, or custom tours based on your interests.",
    experiences: "Browse authentic cultural experiences curated by locals. From cooking classes to traditional ceremonies, find unique ways to connect with different cultures.",
    languages: "Learn languages with native speakers through our interactive lessons. Practice real conversations while discovering cultural contexts.",
    registration: "Ready to share your culture or expertise? Register as a tour operator, language teacher, cultural guide, or event venue to connect with travelers.",
    dashboard: "Your personal dashboard shows your upcoming trips, passport rewards, and personalized recommendations based on your travel interests."
  };

  const getNavigationHelp = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('home') || message.includes('main page')) {
      return navigationResponses.home;
    } else if (message.includes('destination') || message.includes('places') || message.includes('cities')) {
      return navigationResponses.destinations;
    } else if (message.includes('tour') || message.includes('guide') || message.includes('book')) {
      return navigationResponses.tours;
    } else if (message.includes('experience') || message.includes('cultural') || message.includes('authentic')) {
      return navigationResponses.experiences;
    } else if (message.includes('language') || message.includes('learn') || message.includes('speak')) {
      return navigationResponses.languages;
    } else if (message.includes('register') || message.includes('sign up') || message.includes('become')) {
      return navigationResponses.registration;
    } else if (message.includes('dashboard') || message.includes('profile') || message.includes('account')) {
      return navigationResponses.dashboard;
    } else if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I'm Atlas, your travel planning assistant for Travelogie. I can help you navigate the site and find authentic cultural experiences. What would you like to explore today?";
    } else {
      return `I can help you navigate Travelogie and find amazing cultural experiences. You can explore destinations, book tours with local guides, learn languages from native speakers, or register to share your own cultural expertise. What specific area interests you most?`;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message to conversation
    const newConversation = [...conversation, { role: 'user' as const, content: userMessage }];
    setConversation(newConversation);

    // Generate Atlas response
    const atlasResponse = getNavigationHelp(userMessage);
    const updatedConversation = [...newConversation, { role: 'atlas' as const, content: atlasResponse }];
    setConversation(updatedConversation);

    // Convert to speech
    await speakText(atlasResponse);
  };

  const speakText = async (text: string) => {
    try {
      setIsPlaying(true);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voiceId: '9BWtsMINqrJLrRacOk9x', // Aria voice
          model: 'eleven_multilingual_v2'
        }
      });

      if (error) throw new Error(error.message);
      if (!data) throw new Error('No response from text-to-speech service');
      if ((data as any).error) throw new Error((data as any).error);

      if (data.audioContent) {
        const contentType = data.contentType || 'audio/mpeg';
        const base64 = data.audioContent as string;

        if (audioRef.current) {
          // Ensure best playback compatibility (iOS/Android)
          audioRef.current.setAttribute('playsinline', 'true');
          audioRef.current.preload = 'auto';

          // Prefer data URL to avoid blob decoding issues, with blob fallback
          const dataUrl = `data:${contentType};base64,${base64}`;
          try {
            audioRef.current.src = dataUrl;
            await audioRef.current.play();
          } catch (playErr) {
            console.warn('Data URL play failed, trying Blob fallback', playErr);
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
            const audioBlob = new Blob([bytes], { type: contentType });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.onended = () => {
              setIsPlaying(false);
              URL.revokeObjectURL(audioUrl);
            };
            await audioRef.current.play();
          }
        }
      } else {
        throw new Error('No audio content received');
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      toast({
        title: 'Audio Error',
        description: error instanceof Error ? error.message : 'Could not play Atlas response',
        variant: 'destructive',
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isEnabled) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} />
      
      {isExpanded && (
        <Card className="mb-4 w-80 max-h-96 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="font-medium text-sm">Atlas Travel Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="max-h-48 overflow-y-auto mb-3 space-y-2">
              {conversation.length === 0 && (
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                  Hi! I'm Atlas, your Travelogie guide. Ask me about destinations, tours, or how to navigate the site!
                </div>
              )}
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  }`}
                >
                  <div className="font-medium text-xs mb-1">
                    {msg.role === 'user' ? 'You' : 'Atlas'}
                  </div>
                  {msg.content}
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Ask Atlas about Travelogie..."}
                className={`min-h-[40px] resize-none ${isListening ? 'border-primary animate-pulse' : ''}`}
                rows={1}
              />
              {speechSupported && (
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className="min-w-[40px]"
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isPlaying}
                size="icon"
                className="min-w-[40px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6 animate-pulse" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </Button>
        
        <Button
          onClick={onToggle}
          variant="outline"
          size="icon"
          className="rounded-full w-10 h-10 shadow-md"
        >
          <VolumeX className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default AtlasVoiceInterface;