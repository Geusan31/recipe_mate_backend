export interface IngredientGroup {
  group: string;
  items: string[];
}

export class Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categories?: string[];
  time: number;
  servings: number;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  rating: number;
  popularity?: number;
  image?: string;
  ingredients: IngredientGroup[];
  steps: string[];
  tips?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
