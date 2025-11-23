"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User, Post as PostType, backend } from '@/lib/mock-backend';
import { Post } from '@/components/Post';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, MapPin, Link as LinkIcon, Calendar, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const user = backend.getUser(username);
    if (user) {
      setProfileUser(user);
      const userPosts = backend.getUserPosts(username);
      setPosts(userPosts);
    }
    setLoading(false);
  }, [username, currentUser]); // Re-fetch if current user changes (for private post visibility)

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <h1 className="text-2xl font-bold mb-2">User not found</h1>
        <p>The musician you are looking for is not on this stage.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profileUser.id;
  const isFriend = currentUser && (profileUser.followers.includes(currentUser.id) || isOwnProfile);
  const canSeePrivate = !profileUser.isPrivate || isFriend;

  return (
    <main className="flex min-h-screen flex-col items-center pt-8 pb-24">
      {/* Profile Header */}
      <div className="w-full max-w-4xl px-4 mb-8">
        <Card className="border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />
          <CardHeader className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-12 px-4">
              <Avatar className="w-32 h-32 border-4 border-black text-4xl">
                <AvatarImage src={profileUser.avatarUrl} alt={profileUser.displayName} />
                <AvatarFallback>{profileUser.displayName[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 mb-2">
                <h1 className="text-3xl font-bold text-white">{profileUser.displayName}</h1>
                <p className="text-muted-foreground">@{profileUser.username}</p>
              </div>

              <div className="flex gap-2 mb-4 md:mb-2">
                {isOwnProfile ? (
                  <Button variant="outline">Edit Profile</Button>
                ) : (
                  <Button variant={isFriend ? "secondary" : "premium"}>
                    {isFriend ? 'Following' : 'Follow'}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-lg text-white/90 mb-6 max-w-2xl">
              {profileUser.bio}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>New York, NY</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="hover:text-primary transition-colors">metronome.com/{profileUser.username}</a>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Joined November 2025</span>
              </div>
            </div>

            <div className="flex gap-6 mt-6 pt-6 border-t border-white/5">
              <div className="flex gap-1">
                <span className="font-bold text-white">{profileUser.following.length}</span>
                <span className="text-muted-foreground">Following</span>
              </div>
              <div className="flex gap-1">
                <span className="font-bold text-white">{profileUser.followers.length}</span>
                <span className="text-muted-foreground">Followers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Content */}
      <div className="w-full max-w-2xl px-4">
        <h2 className="text-xl font-bold text-white mb-6">Posts</h2>
        
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-xl border border-white/5">
            {profileUser.isPrivate && !isFriend ? (
              <div className="flex flex-col items-center gap-2">
                <Lock className="w-8 h-8 mb-2" />
                <p>This account is private.</p>
                <p className="text-sm">Follow to see their posts.</p>
              </div>
            ) : (
              <p>No posts yet.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
