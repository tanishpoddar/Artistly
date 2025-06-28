import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Music, PartyPopper, Podcast, Smile, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Artist category configuration for the homepage
 * Each category has an icon, name, and navigation link
 */
const categories = [
  { name: "Singers", icon: <Mic className="h-12 w-12" />, href: "/artists?category=singer" },
  { name: "Dancers", icon: <PartyPopper className="h-12 w-12" />, href: "/artists?category=dancer" },
  { name: "DJs", icon: <Music className="h-12 w-12" />, href: "/artists?category=dj" },
  { name: "Speakers", icon: <Podcast className="h-12 w-12" />, href: "/artists?category=speaker" },
  { name: "Magicians", icon: <Wand2 className="h-12 w-12" />, href: "/artists?category=magician" },
  { name: "Comedians", icon: <Smile className="h-12 w-12" />, href: "/artists?category=comedian" },
];

/**
 * Homepage component for Artistly
 * 
 * Features:
 * - Hero section with platform overview and CTAs
 * - Artist category showcase with navigation
 * - Call-to-action for artist onboarding
 * 
 * @returns JSX.Element - The complete homepage layout
 */
export default function Home() {
  return (
    <>
      {/* Hero Section - Main platform introduction */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            {/* Hero Content - Left side */}
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Find the Perfect Artist for Your Next Event
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Artistly is the premier platform for connecting event planners with talented performing artists. Browse, book, and manage with ease.
                </p>
              </div>
              {/* Call-to-Action Buttons */}
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/artists">Explore Artists</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/onboarding">Become an Artist</Link>
                </Button>
              </div>
            </div>
            {/* Hero Image - Right side */}
            <Image
              src="https://placehold.co/600x600.png"
              width="600"
              height="600"
              alt="Hero"
              data-ai-hint="stage performance"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* Categories Section - Artist type showcase */}
      <section id="categories" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          {/* Section Header */}
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Discover Top Talent</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whatever your event needs, find the perfect performer from our diverse categories.
              </p>
            </div>
          </div>
          {/* Category Cards Grid */}
          <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((category) => (
              <Link href={category.href} key={category.name}>
                <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                    {category.icon}
                    <p className="text-lg font-semibold">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Artist onboarding promotion */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Ready to Join Our Roster of Stars?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Showcase your talent to a world of opportunities. Our onboarding is simple, quick, and puts you in front of top event planners.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/onboarding">Onboard Now</Link>
                </Button>
          </div>
        </div>
      </section>
    </>
  );
}
