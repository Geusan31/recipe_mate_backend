import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsIn,
  IsArray,
  IsOptional,
} from 'class-validator';
import { IngredientGroup } from '../entities/recipe.entity';

export class CreateRecipeDto {
  @IsString({ message: 'Judul resep harus berupa teks' })
  @IsNotEmpty({ message: 'Judul resep tidak boleh kosong' })
  @MinLength(3, { message: 'Judul resep minimal harus 3 karakter' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Slug harus berupa teks' })
  slug?: string;

  @IsString({ message: 'Deskripsi harus berupa teks' })
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  description: string;

  @IsString({ message: 'Kategori harus berupa teks' })
  @IsNotEmpty({ message: 'Kategori tidak boleh kosong' })
  category: string;

  @IsOptional()
  @IsArray({ message: 'Categories harus berupa array teks' })
  categories?: string[];

  @IsNumber({}, { message: 'Waktu memasak harus berupa angka dalam menit' })
  @Min(1, { message: 'Waktu memasak minimal 1 menit' })
  time: number;

  @IsNumber({}, { message: 'Jumlah porsi harus berupa angka' })
  @Min(1, { message: 'Jumlah porsi minimal 1' })
  servings: number;

  @IsString({ message: 'Tingkat kesulitan harus berupa teks' })
  @IsIn(['Mudah', 'Sedang', 'Sulit'], {
    message: 'Tingkat kesulitan harus bernilai: Mudah, Sedang, atau Sulit',
  })
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';

  @IsOptional()
  @IsNumber({}, { message: 'Rating harus berupa angka' })
  @Min(0, { message: 'Rating minimal 0' })
  @Max(5, { message: 'Rating maksimal 5' })
  rating?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Popularitas harus berupa angka' })
  popularity?: number;

  @IsOptional()
  @IsString({ message: 'URL gambar harus berupa teks' })
  image?: string;

  @IsArray({ message: 'Bahan-bahan (ingredients) harus berupa array' })
  @IsNotEmpty({ message: 'Bahan-bahan tidak boleh kosong' })
  ingredients: IngredientGroup[];

  @IsArray({ message: 'Langkah memasak (steps) harus berupa array teks' })
  @IsNotEmpty({ message: 'Langkah memasak tidak boleh kosong' })
  steps: string[];

  @IsOptional()
  @IsString({ message: 'Tips harus berupa teks' })
  tips?: string;

  @IsOptional()
  @IsArray({ message: 'Tags harus berupa array teks' })
  tags?: string[];
}
