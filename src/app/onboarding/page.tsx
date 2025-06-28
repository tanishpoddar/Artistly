import { ArtistForm } from '@/components/onboarding/ArtistForm';

export default function OnboardingPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline">Join Artistly</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
          Complete the form below to create your artist profile and start getting booked for events.
        </p>
      </div>
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-xl border">
        <ArtistForm />
      </div>
    </div>
  );
}
