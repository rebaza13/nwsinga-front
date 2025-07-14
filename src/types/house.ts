/**
 * House interface matching the Supabase houses table structure
 */
export interface House {
  id: string;
  title: string;
  description: string;
  square_m: number;
  direction: string;
  floor: number;
  price: number;
  img_url?: string;
  owner_phone?: string;
  created_at: string;
  images?: string[];
}

/**
 * House card props for the component
 */
export interface HouseCardProps {
  house: House
  index: number
}

/**
 * House modal props
 */
export interface HouseModalProps {
  visible: boolean
  house: House
  houses: House[]
  currentIndex: number
}

/**
 * Filter options for houses
 */
export interface HouseFilters {
  areaRange: string
  direction: string
  floors: string
}

/**
 * Sort options for houses
 */
export type SortOption = 'newest' | 'area-high' | 'area-low' | 'name' 