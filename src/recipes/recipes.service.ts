import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { INITIAL_RECIPES } from './recipes.data';

@Injectable()
export class RecipesService {
  // In-memory array storage as requested in Tugas 9
  private recipes: Recipe[] = [...INITIAL_RECIPES];

  create(createRecipeDto: CreateRecipeDto): Recipe {
    // Check duplicate title
    const titleExists = this.recipes.some(
      (r) =>
        r.title.trim().toLowerCase() === createRecipeDto.title.trim().toLowerCase(),
    );
    if (titleExists) {
      throw new ConflictException(
        `Resep dengan judul "${createRecipeDto.title}" sudah terdaftar!`,
      );
    }

    // Generate slug if not provided
    const slug =
      createRecipeDto.slug ||
      createRecipeDto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Check duplicate slug
    const slugExists = this.recipes.some((r) => r.slug === slug);
    if (slugExists) {
      throw new ConflictException(`Resep dengan slug "${slug}" sudah terdaftar!`);
    }

    const newRecipe: Recipe = {
      id: String(Date.now()),
      slug,
      ...createRecipeDto,
      rating: createRecipeDto.rating ?? 0,
      popularity: createRecipeDto.popularity ?? 60,
      categories: createRecipeDto.categories ?? [
        createRecipeDto.category.toLowerCase().replace(/\s+/g, '-'),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.recipes.unshift(newRecipe);
    return newRecipe;
  }

  findAll(search?: string, category?: string): Recipe[] {
    let result = [...this.recipes];

    if (category) {
      const cat = category.toLowerCase();
      result = result.filter(
        (r) =>
          r.category.toLowerCase() === cat ||
          (r.categories && r.categories.some((c) => c.toLowerCase() === cat)),
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q))),
      );
    }

    return result;
  }

  findOne(idOrSlug: string): Recipe {
    const recipe = this.recipes.find(
      (r) => r.id === idOrSlug || r.slug === idOrSlug,
    );
    if (!recipe) {
      throw new NotFoundException(
        `Resep dengan ID atau slug "${idOrSlug}" tidak ditemukan!`,
      );
    }
    return recipe;
  }

  update(idOrSlug: string, updateRecipeDto: UpdateRecipeDto): Recipe {
    const index = this.recipes.findIndex(
      (r) => r.id === idOrSlug || r.slug === idOrSlug,
    );
    if (index === -1) {
      throw new NotFoundException(
        `Resep dengan ID atau slug "${idOrSlug}" tidak ditemukan!`,
      );
    }

    if (updateRecipeDto.title) {
      const targetTitle = updateRecipeDto.title.trim().toLowerCase();
      const conflict = this.recipes.some(
        (r, idx) =>
          idx !== index &&
          r.title.trim().toLowerCase() === targetTitle,
      );
      if (conflict) {
        throw new ConflictException(
          `Resep dengan judul "${updateRecipeDto.title}" sudah terdaftar!`,
        );
      }
    }

    const current = this.recipes[index];
    const updatedRecipe: Recipe = {
      ...current,
      ...updateRecipeDto,
      updatedAt: new Date(),
    };

    this.recipes[index] = updatedRecipe;
    return updatedRecipe;
  }

  remove(idOrSlug: string): { message: string; recipe: Recipe } {
    const index = this.recipes.findIndex(
      (r) => r.id === idOrSlug || r.slug === idOrSlug,
    );
    if (index === -1) {
      throw new NotFoundException(
        `Resep dengan ID atau slug "${idOrSlug}" tidak ditemukan!`,
      );
    }

    const [deleted] = this.recipes.splice(index, 1);
    return {
      message: `Resep "${deleted.title}" berhasil dihapus.`,
      recipe: deleted,
    };
  }
}
