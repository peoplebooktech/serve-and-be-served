import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I saw your profile and I'm interested in collaborating on a project. Could we discuss the details?",
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      content: "Hi! Absolutely, I'd be happy to discuss. What kind of project are you thinking about?",
      sender: 'user',
      timestamp: new Date(Date.now() - 3000000)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [smartReplies, setSmartReplies] = useState<any[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(false);
  const { toast } = useToast();

  const generateSmartReplies = async () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.sender === 'user') {
      toast({
        title: "Info",
        description: "Smart replies work best when responding to received messages",
      });
      return;
    }

    setLoadingReplies(true);
    try {
      const conversationHistory = messages
        .slice(-3)
        .map(m => `${m.sender === 'user' ? 'You' : 'Other'}: ${m.content}`);

      const { data, error } = await supabase.functions.invoke('ai-smart-reply', {
        body: {
          message: lastMessage.content,
          context: 'Professional collaboration discussion',
          userRole: 'Consumer',
          conversationHistory
        }
      });

      if (error) throw error;
      if (!data?.suggestions) throw new Error('No smart replies received');

      setSmartReplies(data.suggestions);
      setShowSmartReplies(true);
      toast({
        title: "Success",
        description: "Smart replies generated! Choose one to send.",
      });
    } catch (error) {
      console.error('Error generating smart replies:', error);
      toast({
        title: "Error",
        description: "Failed to generate smart replies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingReplies(false);
    }
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setShowSmartReplies(false);
    setSmartReplies([]);
    
    toast({
      title: "Sent",
      description: "Message sent successfully",
    });
  };

  const useSmartReply = (reply: any) => {
    sendMessage(reply.text);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            
            <h1 className="text-4xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">
              Collaborate with AI-powered smart replies
            </p>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Conversation with John Doe
              </CardTitle>
            </CardHeader>
            
            {/* Messages Area */}
            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue text-white'
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Smart Replies Section */}
              {showSmartReplies && smartReplies.length > 0 && (
                <div className="mb-4 p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">
                      ✨ Smart Reply Suggestions
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSmartReplies(false)}
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {smartReplies.map((reply, index) => (
                      <div
                        key={index}
                        className="p-2 border rounded cursor-pointer hover:bg-background transition-colors"
                        onClick={() => useSmartReply(reply)}
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs mb-1">
                            {reply.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendMessage(newMessage);
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSmartReplies}
                  disabled={loadingReplies}
                  className="shrink-0"
                >
                  {loadingReplies ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={() => sendMessage(newMessage)}
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue text-white shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;