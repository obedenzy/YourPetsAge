import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import PostCard from "@/components/forum/post-card";

export default function Forums() {
  const [selectedCategory, setSelectedCategory] = useState("Young Adults (1-3 years)");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sortBy, setSortBy] = useState("Latest Posts");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/forum/posts", selectedCategory],
  });

  const createPost = useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiRequest("POST", "/api/forum/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      setShowCreateForm(false);
      setTitle("");
      setContent("");
      toast({
        title: "Post Created",
        description: "Your forum post has been created successfully!",
      });
    },
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest("POST", `/api/forum/posts/${postId}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPost.mutateAsync({
        category: selectedCategory,
        title,
        content,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const categories = [
    "Puppies (0-1 year)",
    "Young Adults (1-3 years)",
    "Adults (3-7 years)",
    "Seniors (7+ years)",
    "General Discussion",
    "Health & Wellness"
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]" data-testid="loading-spinner">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="forums-page">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Forums</h1>
          <p className="text-xl text-muted-foreground">Join age-specific discussions with fellow pet owners</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Forum Categories */}
          <div className="lg:col-span-1">
            <Card data-testid="forum-categories">
              <CardHeader>
                <CardTitle>Forum Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left p-3 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {category}
                  </button>
                ))}
                
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setShowCreateForm(true)}
                  data-testid="button-new-post"
                >
                  <i className="fas fa-plus mr-2"></i>
                  New Post
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Forum Posts */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold" data-testid="current-category">
                  {selectedCategory}
                </h2>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Latest Posts">Latest Posts</SelectItem>
                    <SelectItem value="Most Replied">Most Replied</SelectItem>
                    <SelectItem value="Most Liked">Most Liked</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Create Post Form */}
              {showCreateForm && (
                <Card data-testid="create-post-form">
                  <CardHeader>
                    <CardTitle>Create New Post</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Post Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter a descriptive title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          data-testid="input-post-title"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Share your thoughts, questions, or experiences..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={4}
                          data-testid="textarea-post-content"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          disabled={createPost.isPending}
                          data-testid="button-submit-post"
                        >
                          {createPost.isPending ? "Creating..." : "Create Post"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCreateForm(false)}
                          data-testid="button-cancel-post"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Posts List */}
              <div className="space-y-4">
                {posts?.map((post: any) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={() => likePost.mutate(post.id)}
                    data-testid={`post-${post.id}`}
                  />
                ))}

                {(!posts || posts.length === 0) && (
                  <div className="text-center py-12" data-testid="no-posts-message">
                    <i className="fas fa-comments text-4xl text-muted-foreground mb-4"></i>
                    <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                    <p className="text-muted-foreground mb-6">Be the first to start a discussion in this category!</p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <i className="fas fa-plus mr-2"></i>
                      Create First Post
                    </Button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {posts && posts.length > 0 && (
                <div className="flex justify-center mt-8" data-testid="pagination">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" data-testid="button-prev-page">
                      <i className="fas fa-chevron-left"></i>
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm" data-testid="button-next-page">
                      <i className="fas fa-chevron-right"></i>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
