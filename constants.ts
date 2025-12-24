
import { RegionWeight } from './types';

// Approximate birth rates per year translated to relative weights
// Data based on global demographic estimates
export const REGION_WEIGHTS: RegionWeight[] = [
  { name: 'India', weight: 0.18, coords: [20.5937, 78.9629], radius: 10 },
  { name: 'China', weight: 0.08, coords: [35.8617, 104.1954], radius: 12 },
  { name: 'Nigeria', weight: 0.06, coords: [9.0820, 8.6753], radius: 6 },
  { name: 'Pakistan', weight: 0.05, coords: [30.3753, 69.3451], radius: 5 },
  { name: 'Indonesia', weight: 0.04, coords: [-0.7893, 113.9213], radius: 8 },
  { name: 'Brazil', weight: 0.02, coords: [-14.2350, -51.9253], radius: 10 },
  { name: 'USA', weight: 0.03, coords: [37.0902, -95.7129], radius: 15 },
  { name: 'Europe', weight: 0.04, coords: [48.8566, 2.3522], radius: 15 },
  { name: 'SE Asia', weight: 0.05, coords: [15.8700, 100.9925], radius: 10 },
  { name: 'Central Africa', weight: 0.15, coords: [0.2248, 20.2714], radius: 15 },
  { name: 'Middle East', weight: 0.04, coords: [23.8859, 45.0792], radius: 8 },
  { name: 'Latin America', weight: 0.05, coords: [-10.0, -60.0], radius: 15 },
  { name: 'Russia', weight: 0.01, coords: [61.5240, 105.3188], radius: 20 },
  { name: 'Other', weight: 0.20, coords: [0, 0], radius: 50 },
];

export const GLOBAL_BIRTH_RATE_PER_SEC = 4.3; // Approx 4.3 births per second globally
