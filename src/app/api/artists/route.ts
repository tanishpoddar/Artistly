import { NextResponse } from 'next/server';
import { artists } from '@/lib/data';

export async function GET() {
  // Simulate a network delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(artists);
}
