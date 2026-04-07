import { Server } from '@/types';

export const servers: Server[] = [
  { id: '1', name: 'CX23', provider: 'Hetzner Cloud', monthlyCost: 3.49, ram: 4, cpu: 2, bandwidth: 20 },
  { id: '2', name: 'VPS 1', provider: 'OVHcloud', monthlyCost: 5.52, ram: 8, cpu: 4, bandwidth: 10 },
  { id: '3', name: 'Basique 1 Go', provider: 'DigitalOcean', monthlyCost: 6, ram: 1, cpu: 1, bandwidth: 0.5 },
  { id: '4', name: 'Basique 2 Go', provider: 'DigitalOcean', monthlyCost: 12, ram: 2, cpu: 1, bandwidth: 1 },
  { id: '5', name: 'Cloud Compute 1 Go', provider: 'Vultr', monthlyCost: 4.96, ram: 1, cpu: 1, bandwidth: 1 },
  { id: '6', name: 'Cloud Compute 2 Go', provider: 'Vultr', monthlyCost: 14.96, ram: 2, cpu: 2, bandwidth: 2 },
  { id: '7', name: 'DEV1-S', provider: 'Scaleway', monthlyCost: 6.42, ram: 2, cpu: 2, bandwidth: 1 },
  { id: '8', name: 'DEV1-M', provider: 'Scaleway', monthlyCost: 14.45, ram: 4, cpu: 3, bandwidth: 2 },
  { id: '9', name: 'VPS 2', provider: 'OVHcloud', monthlyCost: 8.49, ram: 12, cpu: 6, bandwidth: 10 },
  { id: '10', name: 'Basique 4 Go', provider: 'DigitalOcean', monthlyCost: 24, ram: 4, cpu: 2, bandwidth: 2 },
];

export const criteriaConfig = [
  { name: 'Cost', key: 'monthlyCost' as const, weight: 25, direction: 'min' as const },
  { name: 'RAM', key: 'ram' as const, weight: 25, direction: 'max' as const },
  { name: 'CPU', key: 'cpu' as const, weight: 25, direction: 'max' as const },
  { name: 'Bandwidth', key: 'bandwidth' as const, weight: 25, direction: 'max' as const },
];