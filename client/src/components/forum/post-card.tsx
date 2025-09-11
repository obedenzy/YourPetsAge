import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForumPost } from "@shared/schema";

interface PostCardProps {
  post: ForumPost;
  onLike?: () => void;
  onReply?: () => void;
  onViewPost?: () => void;
}

export default function PostCard({ post, onLike, onReply, onViewPost }: PostCardProps) {
  const getInitials = (authorId: string) => {
    // Mock initials based on authorId
    const initials = ["JS", "MR", "AL", "KT", "DM"];
    return initials[parseInt(authorId.slice(-1)) % initials.length];
  };

  const getAuthorName = (authorId: string) => {
    // Mock author names
    const names = ["Jessica S.", "Mark R.", "Amy L.", "Kevin T.", "Diana M."];
    return names[parseInt(authorId.slice(-1)) % names.length];
  };

  const getCategoryColor = (category: string) => {
    if (category.includes("Puppy")) return "bg-accent/20 text-accent";
    if (category.includes("Young Adult")) return "bg-primary/20 text-primary";
    if (category.includes("Adult")) return "bg-green-500/20 text-green-500";
    if (category.includes("Senior")) return "bg-purple-500/20 text-purple-500";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="hover:shadow-lg transition-all" data-testid={`post-card-${post.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary-foreground">{getInitials(post.authorId)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-semibold">{getAuthorName(post.authorId)}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <Badge className={getCategoryColor(post.category)}>
                {post.category.includes("Training") ? "Training" : 
                 post.category.includes("Nutrition") ? "Nutrition" : 
                 post.category.includes("Health") ? "Health" : "General"}
              </Badge>
            </div>
            <h4 className="font-semibold mb-2" data-testid={`post-title-${post.id}`}>
              {post.title}
            </h4>
            <p className="text-muted-foreground text-sm mb-3" data-testid={`post-content-${post.id}`}>
              {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              {onLike && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground p-0 h-auto"
                  onClick={onLike}
                  data-testid={`button-like-${post.id}`}
                >
                  <i className="fas fa-heart mr-1"></i>
                  <span>{post.likes}</span>
                </Button>
              )}
              {onReply && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground p-0 h-auto"
                  onClick={onReply}
                  data-testid={`button-reply-${post.id}`}
                >
                  <i className="fas fa-comment mr-1"></i>
                  <span>{post.replies} replies</span>
                </Button>
              )}
              {onViewPost && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                  onClick={onViewPost}
                  data-testid={`button-view-${post.id}`}
                >
                  View Discussion
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
