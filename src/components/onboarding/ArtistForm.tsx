'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { categories, languages, feeRanges, transformFormDataToArtist } from '@/lib/types';
import { MultiSelect } from '@/components/ui/multi-select';
import { useNotifications, useArtists } from '@/contexts/AppContext';

/**
 * Form validation schema using Zod
 * Ensures all required fields are properly validated
 */
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters.' }).max(500, { message: 'Bio must not exceed 500 characters.' }),
  categories: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one category.',
  }),
  languages: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one language.',
  }),
  feeRange: z.string({ required_error: 'Please select a fee range.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  profileImage: z.any().optional(),
});

/**
 * Artist onboarding form component
 * 
 * Features:
 * - Comprehensive form validation with Zod
 * - Multi-select dropdowns with checkboxes
 * - File upload for profile images
 * - Global notification system integration
 * - Responsive design
 * 
 * @returns JSX.Element - Complete artist onboarding form
 */
export function ArtistForm() {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { addTemporaryArtist } = useArtists();
  
  // Form instance with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bio: '',
      categories: [],
      languages: [],
      location: '',
    },
  });

  /**
   * Handle form submission
   * Processes form data and shows success feedback
   * 
   * @param values - Validated form data
   */
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Log form data for debugging
    console.log('Form submitted:', values);
    
    // Transform form data to Artist type and add to global state
    const newArtist = transformFormDataToArtist(values);
    console.log('New artist being added:', newArtist);
    addTemporaryArtist(newArtist);
    
    // Show success toast notification
    toast({
      title: 'Profile Submitted!',
      description: 'Your artist profile has been successfully submitted and is now visible in the artists listing.',
    });
    
    // Add global notification
    addNotification({
      type: 'success',
      message: `Artist profile for ${values.name} has been submitted successfully and is now visible in the artists listing.`,
    });
    
    // Reset form to initial state
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Artist Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Eleanora Vance" {...field} />
                  </FormControl>
                  <FormDescription>Your professional or stage name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Location Field */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New York, NY" {...field} />
                  </FormControl>
                  <FormDescription>Your city and state/country.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        {/* Biography Section */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your talent, experience, and what makes you unique..." 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                A short bio of 50-500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories and Fee Range Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories Multi-Select */}
          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                    <MultiSelect
                        options={categories}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select your art forms"
                    />
                </FormControl>
                 <FormDescription>Select all categories that apply.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fee Range Dropdown */}
          <FormField
            control={form.control}
            name="feeRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Standard Fee Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fee range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {feeRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Languages Multi-Select */}
        <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages Spoken</FormLabel>
                <FormControl>
                    <MultiSelect
                        options={languages}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select languages"
                    />
                </FormControl>
                <FormDescription>
                  Select all languages you are comfortable performing in.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Profile Image Upload */}
        <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Profile Image (Optional)</FormLabel>
                <FormControl>
                    <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} 
                    />
                </FormControl>
                <FormDescription>
                    Upload a high-quality headshot or performance photo.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
        />

        {/* Submit Button */}
        <Button 
            type="submit" 
            size="lg" 
            className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/80"
        >
            Submit Profile
        </Button>
      </form>
    </Form>
  );
}
