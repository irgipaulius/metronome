"use client";

import { Post as PostType, User } from '@/lib/mock-backend';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Lock, Globe, Play } from 'lucide-react';
import { useState } from 'react';

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  // In a real app with Supabase join, author is attached to post
  // We need to extend the type or cast it
  const author = (post as any).author as User;
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  // No need for useEffect fetch anymore as data comes joined

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  if (!author) return <div className="animate-pulse h-48 bg-card rounded-xl" />;

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 overflow-hidden border-white/5 bg-black/40 backdrop-blur-md hover:border-primary/20 transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar>
          <AvatarImage src={author.avatarUrl} alt={author.displayName} />
          <AvatarFallback>{author.displayName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{author.displayName}</span>
            <span className="text-xs text-muted-foreground">@{author.username}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            {post.isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-base leading-relaxed text-white/90 whitespace-pre-wrap mb-4">
          {post.content}
        </p>

        {post.type === 'video' && post.mediaUrl && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-white/10 group cursor-pointer">
            {/* Mock Video Player */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            <img 
              src={`https://source.unsplash.com/random/800x450?concert,music&sig=${post.id}`} 
              alt="Video thumbnail" 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        )}

        {post.type === 'game' && (
          <div className="w-full p-6 rounded-lg bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/10 flex flex-col items-center justify-center gap-4 text-center">
            <div className="text-4xl">🎮</div>
            <h3 className="text-xl font-bold text-white">Interactive Rhythm Game</h3>
            <p className="text-sm text-muted-foreground">Challenge your friends to beat your score!</p>
            <Button variant="premium">Play Now</Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-white/5">
        <div className="flex w-full items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-white'}`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
