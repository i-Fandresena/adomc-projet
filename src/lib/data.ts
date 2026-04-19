import { Server } from '@/types';

interface ProviderSeed {
  provider: string;
  region: string;
  factor: number;
  networkBias: number;
}

interface PlanSeed {
  code: string;
  ram: number;
  cpu: number;
  bandwidth: number;
  baseCost: number;
}

const providerSeeds: ProviderSeed[] = [
  { provider: 'AWS EC2', region: 'us-east-1', factor: 1.5, networkBias: 1.1 },
  { provider: 'AWS EC2', region: 'eu-west-1', factor: 1.58, networkBias: 1.05 },
  { provider: 'Google Cloud', region: 'us-central1', factor: 1.48, networkBias: 1.1 },
  { provider: 'Google Cloud', region: 'europe-west1', factor: 1.56, networkBias: 1.05 },
  { provider: 'Microsoft Azure', region: 'eastus', factor: 1.52, networkBias: 1.08 },
  { provider: 'Microsoft Azure', region: 'westeurope', factor: 1.6, networkBias: 1.02 },
  { provider: 'Oracle Cloud', region: 'frankfurt', factor: 1.18, networkBias: 1.05 },
  { provider: 'Oracle Cloud', region: 'phoenix', factor: 1.12, networkBias: 1.1 },
  { provider: 'DigitalOcean', region: 'nyc3', factor: 1.0, networkBias: 1.0 },
  { provider: 'DigitalOcean', region: 'ams3', factor: 1.05, networkBias: 1.0 },
  { provider: 'Vultr', region: 'new-york', factor: 0.97, networkBias: 1.0 },
  { provider: 'Vultr', region: 'paris', factor: 1.03, networkBias: 0.98 },
  { provider: 'Linode Akamai', region: 'newark', factor: 0.98, networkBias: 1.0 },
  { provider: 'Linode Akamai', region: 'frankfurt', factor: 1.04, networkBias: 0.98 },
  { provider: 'Hetzner Cloud', region: 'hel1', factor: 0.82, networkBias: 1.2 },
  { provider: 'Hetzner Cloud', region: 'nbg1', factor: 0.78, networkBias: 1.15 },
  { provider: 'OVHcloud', region: 'gra', factor: 0.9, networkBias: 1.05 },
  { provider: 'OVHcloud', region: 'bhs', factor: 0.95, networkBias: 1.0 },
  { provider: 'Scaleway', region: 'paris-2', factor: 0.88, networkBias: 1.08 },
  { provider: 'Scaleway', region: 'warsaw-1', factor: 0.92, networkBias: 1.05 },
  { provider: 'Alibaba Cloud', region: 'singapore', factor: 1.2, networkBias: 1.02 },
  { provider: 'Alibaba Cloud', region: 'frankfurt', factor: 1.25, networkBias: 1.0 },
  { provider: 'Tencent Cloud', region: 'tokyo', factor: 1.15, networkBias: 1.04 },
  { provider: 'Tencent Cloud', region: 'frankfurt', factor: 1.22, networkBias: 0.99 },
  { provider: 'IBM Cloud', region: 'dallas', factor: 1.3, networkBias: 1.0 },
  { provider: 'IBM Cloud', region: 'frankfurt', factor: 1.35, networkBias: 0.98 },
  { provider: 'UpCloud', region: 'helsinki', factor: 1.04, networkBias: 1.08 },
  { provider: 'UpCloud', region: 'amsterdam', factor: 1.08, networkBias: 1.04 },
  { provider: 'IONOS Cloud', region: 'berlin', factor: 0.94, networkBias: 1.02 },
  { provider: 'IONOS Cloud', region: 'london', factor: 1.0, networkBias: 0.99 },
  { provider: 'Contabo', region: 'munich', factor: 0.74, networkBias: 0.95 },
  { provider: 'Contabo', region: 'seattle', factor: 0.8, networkBias: 0.95 },
];

const planSeeds: PlanSeed[] = [
  { code: 'nano', ram: 1, cpu: 1, bandwidth: 0.8, baseCost: 3.2 },
  { code: 'micro', ram: 2, cpu: 1, bandwidth: 1, baseCost: 4.8 },
  { code: 'small', ram: 4, cpu: 2, bandwidth: 2, baseCost: 7.5 },
  { code: 'medium', ram: 8, cpu: 4, bandwidth: 4, baseCost: 14 },
  { code: 'large', ram: 16, cpu: 8, bandwidth: 6, baseCost: 26 },
  { code: 'xlarge', ram: 32, cpu: 12, bandwidth: 10, baseCost: 44 },
  { code: '2xlarge', ram: 64, cpu: 16, bandwidth: 16, baseCost: 78 },
  { code: '4xlarge', ram: 128, cpu: 24, bandwidth: 25, baseCost: 132 },
];

export const servers: Server[] = providerSeeds.flatMap((providerSeed, providerIndex) =>
  planSeeds.map((planSeed, planIndex) => {
    const monthlyCost = Number((planSeed.baseCost * providerSeed.factor).toFixed(2));
    const regionBoost = 1 + (providerIndex % 3) * 0.04;
    const cpuBoost = 1 + (providerIndex % 4) * 0.03;

    return {
      id: `${providerIndex + 1}-${planIndex + 1}`,
      name: `${planSeed.code.toUpperCase()} ${providerSeed.region}`,
      provider: providerSeed.provider,
      monthlyCost,
      ram: Math.round(planSeed.ram * regionBoost),
      cpu: Number((planSeed.cpu * cpuBoost).toFixed(1)),
      bandwidth: Number((planSeed.bandwidth * providerSeed.networkBias).toFixed(1)),
    };
  })
);

export const criteriaConfig = [
  { name: 'Cost', key: 'monthlyCost' as const, weight: 25, direction: 'min' as const },
  { name: 'RAM', key: 'ram' as const, weight: 25, direction: 'max' as const },
  { name: 'CPU', key: 'cpu' as const, weight: 25, direction: 'max' as const },
  { name: 'Bandwidth', key: 'bandwidth' as const, weight: 25, direction: 'max' as const },
];