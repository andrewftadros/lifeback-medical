import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    icon: z.string().optional(),
    order: z.number(),
    relatedServices: z.array(z.string()).optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    image: z.string().optional(),
    author: z.string().default('Life Back Medical'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { services, blog };
