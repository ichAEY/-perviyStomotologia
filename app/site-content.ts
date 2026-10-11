import data from '../public/site-data.js';
import { formatPrice } from '../public/validation.js';

export const site = data;
export const copy = data.template;
export const clinic = data.clinic;
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => `${basePath}${path.startsWith('/') ? path : `/${path.replace(/^\.\//, '')}`}`;
export const services = Object.fromEntries(data.services.map((service) => [service.id, {
  tab: service.title, eyebrow: copy.serviceEyebrow, title: service.title,
  summary: service.description,
  gives: service.items.map((item) => `${item.name} — ${formatPrice(item.price).label}. ${item.includes}`),
  fits: [copy.serviceScope],
  price: formatPrice(service.items[0]?.price).label,
  unit: service.items[0]?.unit || 'По прайс-листу',
  image: clinic.serviceImage,
}])) as Record<string, { tab: string; eyebrow: string; title: string; summary: string; gives: string[]; fits: string[]; price: string; unit: string; image: string }>;
export type ServiceId = string;
export const firstService = data.services[0].id;
export const secondService = data.services[1]?.id ?? firstService;
