"use client";

import { useEffect, useState } from 'react';
import { Post as PostComponent } from './Post';
import { Post } from '@/lib/mock-backend';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            author:profiles(username, display_name, avatar_url)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform data to match Post type if needed, or update Post type
        // For now, assuming the join returns author object correctly
        setPosts(data as any);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {posts.map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </div>
  );
}
