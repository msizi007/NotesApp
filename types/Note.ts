export type Category = "Work" | "Personal";

export interface Note {
  id: string;
  title: string;
  text: string;
  category: Category;
  dateAdded: Date;
}
