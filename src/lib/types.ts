export type Artist = {
  id: string;
  name: string;
  categories: string[];
  location: string;
  priceRange: {
    min: number;
    max: number;
  };
  bio: string;
  imageUrl: string;
  languages: string[];
};

export const categories = [
  { value: 'singer', label: 'Singer' },
  { value: 'dancer', label: 'Dancer' },
  { value: 'dj', label: 'DJ' },
  { value: 'speaker', label: 'Speaker' },
  { value: 'magician', label: 'Magician' },
  { value: 'comedian', label: 'Comedian' },
];

export const languages = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'mandarin', label: 'Mandarin' },
];

export const feeRanges = [
    { value: '0-500', label: '$0 - $500' },
    { value: '500-1000', label: '$500 - $1000' },
    { value: '1000-2500', label: '$1000 - $2500' },
    { value: '2500-5000', label: '$2500 - $5000' },
    { value: '5000+', label: '$5000+' },
];

// Form data type for artist onboarding
export type ArtistFormData = {
  name: string;
  bio: string;
  categories: string[];
  languages: string[];
  feeRange: string;
  location: string;
  profileImage?: File | null;
};

// Utility function to transform form data to Artist type
export function transformFormDataToArtist(formData: ArtistFormData): Artist {
  // Parse fee range to get min and max values
  const parseFeeRange = (feeRange: string) => {
    switch (feeRange) {
      case '0-500':
        return { min: 0, max: 500 };
      case '500-1000':
        return { min: 500, max: 1000 };
      case '1000-2500':
        return { min: 1000, max: 2500 };
      case '2500-5000':
        return { min: 2500, max: 5000 };
      case '5000+':
        return { min: 5000, max: 10000 };
      default:
        return { min: 0, max: 1000 };
    }
  };

  return {
    id: `temp-${Date.now()}`, // Generate temporary ID
    name: formData.name,
    categories: formData.categories,
    location: formData.location,
    priceRange: parseFeeRange(formData.feeRange),
    bio: formData.bio,
    imageUrl: formData.profileImage ? URL.createObjectURL(formData.profileImage) : 'https://placehold.co/400x400.png',
    languages: formData.languages,
  };
}
