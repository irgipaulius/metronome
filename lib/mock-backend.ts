import { v4 as uuidv4 } from 'uuid';

export type User = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  isPrivate: boolean;
  followers: string[];
  following: string[];
};

export type PostType = 'text' | 'video' | 'game' | 'ad';

export type Post = {
  id: string;
  authorId: string;
  type: PostType;
  content: string; // Text content or URL for video/game
  mediaUrl?: string; // Optional thumbnail or secondary media
  createdAt: string;
  likes: number;
  isPrivate: boolean;
};

// --- Mock Data ---

const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    username: 'jimi_hendrix',
    displayName: 'Jimi Hendrix',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
    bio: 'Guitarist, singer, songwriter. Purple Haze all in my brain.',
    isPrivate: false,
    followers: ['user-2', 'user-3'],
    following: ['user-2'],
  },
  {
    id: 'user-2',
    username: 'mozart_wolfie',
    displayName: 'Wolfgang Amadeus Mozart',
    avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop',
    bio: 'Composer. Piano prodigy. Too many notes?',
    isPrivate: false,
    followers: ['user-1'],
    following: ['user-1'],
  },
  {
    id: 'user-3',
    username: 'secret_bass',
    displayName: 'Anonymous Bassist',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop',
    bio: 'Just grooving in the shadows.',
    isPrivate: true,
    followers: [],
    following: [],
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    type: 'text',
    content: 'Excuse me while I kiss the sky! 🎸☁️',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 420,
    isPrivate: false,
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    type: 'video',
    content: 'Check out my new Symphony No. 41. It is fire! 🔥',
    mediaUrl: 'https://www.youtube.com/embed/dT8k9e2a_jY', // Placeholder embed
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    likes: 1791,
    isPrivate: false,
  },
  {
    id: 'post-3',
    authorId: 'user-1',
    type: 'game',
    content: 'Can you match the rhythm? 🥁',
    mediaUrl: '/games/rhythm-master', // Placeholder internal route
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    likes: 50,
    isPrivate: false,
  },
  {
    id: 'post-4',
    authorId: 'user-3',
    type: 'text',
    content: 'Practicing scales in the dark. #basslife',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    likes: 5,
    isPrivate: true,
  },
];

// --- Mock Backend Logic ---

class MockBackend {
  private users: User[] = [...MOCK_USERS];
  private posts: Post[] = [...MOCK_POSTS];
  private currentUser: User | null = null;

  constructor() {
    // Try to load from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('metronome_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
  }

  // Auth
  login(username: string): User | null {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      this.currentUser = user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('metronome_user', JSON.stringify(user));
      }
      return user;
    }
    return null;
  }

  logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('metronome_user');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Users
  getUser(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }

  updateProfile(updates: Partial<User>): User {
    if (!this.currentUser) throw new Error('Not authenticated');
    
    const updatedUser = { ...this.currentUser, ...updates };
    this.users = this.users.map(u => u.id === this.currentUser!.id ? updatedUser : u);
    this.currentUser = updatedUser;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('metronome_user', JSON.stringify(updatedUser));
    }
    return updatedUser;
  }

  // Posts
  getFeed(): Post[] {
    // In a real app, this would filter by friends/following/public
    // For now, return all public posts + private posts visible to current user
    return this.posts.filter(post => {
      if (!post.isPrivate) return true;
      if (this.currentUser && post.authorId === this.currentUser.id) return true;
      if (this.currentUser && this.users.find(u => u.id === post.authorId)?.followers.includes(this.currentUser.id)) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getUserPosts(username: string): Post[] {
    const user = this.getUser(username);
    if (!user) return [];
    
    return this.posts.filter(post => {
      if (post.authorId !== user.id) return false;
      if (!post.isPrivate) return true;
      // Private logic same as feed
      if (this.currentUser && post.authorId === this.currentUser.id) return true;
      if (this.currentUser && user.followers.includes(this.currentUser.id)) return true;
      return false;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createPost(content: string, type: PostType = 'text', isPrivate: boolean = false): Post {
    if (!this.currentUser) throw new Error('Not authenticated');

    const newPost: Post = {
      id: uuidv4(),
      authorId: this.currentUser.id,
      type,
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isPrivate,
    };

    this.posts.unshift(newPost);
    return newPost;
  }
}

export const backend = new MockBackend();
