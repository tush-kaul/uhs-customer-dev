// constants.ts
export const RESIDENCE_DURATION_MAP: Record<string, number> = {
  Studio: 45,
  "1BHK Apartment": 60,
  "1BHK + Study Room": 90,
  "2BHK Apartment": 120,
  "2BHK Townhouse": 150,
  "3BHK Apartment": 150,
  "3BHK Townhouse": 180,
  "3BHK Villa": 210,
  "4BHK Apartment": 210,
  "4BHK Villa": 240,
  "5BHK Apartment": 300,
  "5BHK Villa": 300,
};

export const FREQUENCY_NUMBER_MAPPING: Record<string, number> = {
  one_time: 1,
  once: 1,
  twice: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
};

export const SERVICE_DURATION = [1, 3, 6, 12];

export const SALUTATION_OPTIONS = ["Mr.", "Ms.", "Mrs."];

export const PRESENT_DURING_SERVICE_OPTIONS = ["Yes", "No"];

// Service categories and images - add your actual services here
export const SERVICE_CATEGORIES = [
  {
    id: "residential",
    name: "Residential Cleaning",
    imageUrl: "/images/services/residential.jpg",
    description: "Professional cleaning services for your home",
  },
  {
    id: "commercial",
    name: "Commercial Cleaning",
    imageUrl: "/images/services/commercial.jpg",
    description: "Comprehensive cleaning solutions for businesses",
  },
  {
    id: "specialized",
    name: "Specialized Cleaning",
    imageUrl: "/images/services/specialized.jpg",
    description: "Targeted cleaning for specific areas or items",
  },
];

export const getSliceEndIndex = (frequency: string) => {
  return FREQUENCY_NUMBER_MAPPING[frequency] || 1;
};

export const formatFrequency = (frequency: string) => {
  // Replace underscores with spaces
  let withSpaces = frequency.replace(/_/g, " ");

  // Capitalize the first letter of each word
  let formatted = withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());

  return formatted;
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
