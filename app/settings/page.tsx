"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label'; // Need to install or create Label
import { useState, useEffect } from 'react';
import { backend } from '@/lib/mock-backend';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
    if (user) {
      setDisplayName(user.displayName);
      setBio(user.bio);
      setIsPrivate(user.isPrivate);
    }
  }, [user, isLoading, router]);

  const handleSave = () => {
    if (user) {
      backend.updateProfile({
        displayName,
        bio,
        isPrivate
      });
      // Force reload to update context (in real app context would update automatically)
      window.location.reload();
    }
  };

  if (isLoading || !user) return null;

  return (
    <main className="flex min-h-screen flex-col items-center pt-8 pb-24">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        
        <Card className="border-white/10 bg-black/40 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your public profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Display Name
              </label>
              <Input 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                className="bg-black/20 border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Bio
              </label>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40 backdrop-blur-md mb-8">
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage who can see your content.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
              <div className="space-y-0.5">
                <label className="text-base font-medium">Private Account</label>
                <p className="text-sm text-muted-foreground">
                  Only followers can see your posts and profile details.
                </p>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button variant="premium" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </main>
  );
}
