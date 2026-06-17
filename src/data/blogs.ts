import { blog01 } from "./blogs/blog-01";
import { blog02 } from "./blogs/blog-02";
import { blog03 } from "./blogs/blog-03";
import { blog04 } from "./blogs/blog-04";
import { blog05 } from "./blogs/blog-05";
import { blog06 } from "./blogs/blog-06";
import { blog07 } from "./blogs/blog-07";
import { blog08 } from "./blogs/blog-08";
import { blog09 } from "./blogs/blog-09";
import { blog10 } from "./blogs/blog-10";
import { blog11 } from "./blogs/blog-11";
import { blog12 } from "./blogs/blog-12";
import { blog13 } from "./blogs/blog-13";
import { blog14 } from "./blogs/blog-14";
import { blog15 } from "./blogs/blog-15";
import { blog16 } from "./blogs/blog-16";
import { blog17 } from "./blogs/blog-17";
import { blog18 } from "./blogs/blog-18";
import { blog19 } from "./blogs/blog-19";
import { blog20 } from "./blogs/blog-20";
import { blog21 } from "./blogs/blog-21";
import { blog22 } from "./blogs/blog-22";
import { blog23 } from "./blogs/blog-23";
import { blog24 } from "./blogs/blog-24";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  datePublished?: string;
  dateModified?: string;
  readTime: string;
  excerpt: string;
  category: 'AI' | 'WebDev' | 'Backend' | 'SEO' | 'AppSec' | 'DevOps';
  tags: string[];
  metaDescription: string;
  metaKeywords: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  blog01,
  blog02,
  blog03,
  blog04,
  blog05,
  blog06,
  blog07,
  blog08,
  blog09,
  blog10,
  blog11,
  blog12,
  blog13,
  blog14,
  blog15,
  blog16,
  blog17,
  blog18,
  blog19,
  blog20,
  blog21,
  blog22,
  blog23,
  blog24
];

