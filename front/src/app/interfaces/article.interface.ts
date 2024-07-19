export interface Article {
  id?: number;
  title: string;
  content: string;
  created_at?: Date;
  owner_id?: number;
  theme_id: number;
  updated_at?: Date;
  author?: string;
  theme?: string;
}