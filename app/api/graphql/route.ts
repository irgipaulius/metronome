import { backend } from '@/lib/mock-backend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { query } = await request.json();

  // Very basic mock GraphQL resolver
  // In a real app, use graphql-yoga or apollo-server
  
  let data: any = {};

  if (query.includes('getFeed')) {
    data.feed = backend.getFeed();
  }

  if (query.includes('getUser')) {
    // Extract username from query (very hacky mock parsing)
    const match = query.match(/username: "([^"]+)"/);
    if (match) {
      data.user = backend.getUser(match[1]);
      if (data.user) {
        data.user.posts = backend.getUserPosts(match[1]);
      }
    }
  }

  return NextResponse.json({ data });
}
