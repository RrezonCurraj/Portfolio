import { MetadataRoute } from 'next';
import { portfolioData } from '@/data/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://rrezon.dev';
  const caseStudies = portfolioData.projects
    .filter((p) => 'caseStudy' in p && p.caseStudy && 'slug' in p && p.slug)
    .map((p) => ({
      url: `${base}/projects/${(p as { slug: string }).slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...caseStudies,
  ];
}
