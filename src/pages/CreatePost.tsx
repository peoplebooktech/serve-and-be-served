import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, Loader2, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PostForm {
  title: string;
  content: string;
  category: string;
}

const CreatePost = () => {
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    content: "",
    category: "General",
  });
  const [aiAssist, setAiAssist] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState('');
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof PostForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear AI suggestions when user manually edits
    if (field === 'content') {
      setEnhancedContent('');
    }
  };

  const handleAIAssist = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to enhance",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-post-assistant', {
        body: {
          action: 'enhance_post',
          content: formData.content,
          role: 'Consumer',
          skills: [],
          vertical: formData.category
        }
      });

      if (error) throw error;
      if (!data?.result) throw new Error('No enhanced content received');

      setEnhancedContent(data.result);
      toast({
        title: "Success",
        description: "Content enhanced! Review and apply or keep your original.",
      });
    } catch (error) {
      console.error('Error enhancing content:', error);
      toast({
        title: "Error",
        description: "Failed to enhance content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateHashtags = async () => {
    const contentToUse = enhancedContent || formData.content;
    if (!contentToUse.trim()) {
      toast({
        title: "Error",
        description: "Please enter content first to generate hashtags",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingHashtags(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-post-assistant', {
        body: {
          action: 'generate_hashtags',
          content: contentToUse,
          vertical: formData.category,
          role: 'Consumer'
        }
      });

      if (error) throw error;
      if (!data?.result) throw new Error('No hashtags received');

      const hashtags = data.result.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      setSuggestedHashtags(hashtags);
      toast({
        title: "Success",
        description: "Hashtags generated! Click to add them to your post.",
      });
    } catch (error) {
      console.error('Error generating hashtags:', error);
      toast({
        title: "Error",
        description: "Failed to generate hashtags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  const acceptEnhancedContent = () => {
    setFormData(prev => ({ ...prev, content: enhancedContent }));
    setEnhancedContent('');
    toast({
      title: "Applied",
      description: "Enhanced content has been applied to your post.",
    });
  };

  const rejectEnhancedContent = () => {
    setEnhancedContent('');
  };

  const addHashtagToContent = (hashtag: string) => {
    const currentContent = enhancedContent || formData.content;
    const newContent = currentContent + (currentContent.endsWith(' ') ? '' : ' ') + hashtag;
    setFormData(prev => ({ ...prev, content: newContent }));
    if (enhancedContent) setEnhancedContent('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.content.trim()) {
      toast({
        title: "Validation Error", 
        description: "Content is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Here you would typically save to a posts table
      // For now, we'll just show a success message
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            
            <h1 className="text-4xl font-bold text-foreground mb-2">Create Post</h1>
            <p className="text-muted-foreground">
              Share your thoughts with AI assistance
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  New Post
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAiAssist(!aiAssist)}
                  className={aiAssist ? 'bg-primary/10 text-primary' : ''}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Assist
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  >
                    <option value="General">General</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Content <span className="text-destructive">*</span>
                    </Label>
                    {aiAssist && (
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAIAssist}
                          disabled={isEnhancing || !formData.content.trim()}
                        >
                          {isEnhancing ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 mr-1" />
                              Enhance
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateHashtags}
                          disabled={isGeneratingHashtags}
                        >
                          {isGeneratingHashtags ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Hash className="w-3 h-3 mr-1" />
                              Hashtags
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind? Share your thoughts, ideas, or ask questions..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={6}
                    required
                  />
                  
                  {/* Enhanced Content Preview */}
                  {enhancedContent && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium text-primary">
                          ✨ AI-Enhanced Version
                        </Label>
                        <div className="space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={rejectEnhancedContent}
                          >
                            Keep Original
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={acceptEnhancedContent}
                            className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue text-white"
                          >
                            Use Enhanced
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {enhancedContent}
                      </p>
                    </div>
                  )}

                  {/* Suggested Hashtags */}
                  {suggestedHashtags.length > 0 && (
                    <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                      <Label className="text-sm font-medium text-primary mb-2 block">
                        📌 Suggested Hashtags (click to add)
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {suggestedHashtags.map((hashtag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => addHashtagToContent(hashtag)}
                          >
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Link to="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-peoplebook-purple to-peoplebook-blue text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Publish Post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreatePost;