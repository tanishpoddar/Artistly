import { ArtistTable } from '@/components/dashboard/ArtistTable';
import type { Artist } from '@/lib/types';
import { headers } from 'next/headers';

async function getArtists(): Promise<Artist[]> {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  // Use a dynamic absolute URL for server-side fetching.
  const res = await fetch(`${protocol}://${host}/api/artists`, {
    cache: 'no-store', // Ensure fresh data on each request
  });

  if (!res.ok) {
    // This will be caught by the nearest error boundary
    throw new Error('Failed to fetch artist data');
  }
  
  return res.json();
}


export default async function DashboardPage() {
  const submissions = await getArtists();

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Manager Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage artist submissions.
        </p>
      </div>
      <div className="border rounded-lg shadow-sm">
        <ArtistTable data={submissions} />
      </div>
    </div>
  );
}
