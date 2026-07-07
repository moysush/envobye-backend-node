export interface Contact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  is_favorite: boolean;
  personal_note: string | null;
  user_id: string;
  updated_at?: Date;
}
