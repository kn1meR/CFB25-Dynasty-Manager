export interface Player {
  id: number;
  name: string;
  position: string;
  year: string;
  rating: string;
  devTrait?: 'Normal' | 'Impact' | 'Star' | 'Elite';
  notes?: string;
}