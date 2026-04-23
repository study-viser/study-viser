// this file holds interfaces,
// use something like below to import them
// import type { ListingRow } from '@/lib/types';

// used for parsing the course listing CSV file
export interface ListingRow {
  code: string;
  subject: string;
  title: string;
  credits: string;
  description?: string;
  prerequisites?: string;
  corequisites?: string;
  gen_ed?: string;
  grade_option?: string;
  repeatable?: string;
  major_restrictions?: string;
  class_standing?: string;
  cross_listed?: string;
}
