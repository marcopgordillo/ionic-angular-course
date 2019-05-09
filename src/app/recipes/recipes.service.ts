import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private _recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1024px-Schnitzel.JPG',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Spaghetti_al_Pomodoro.JPG/1024px-Spaghetti_al_Pomodoro.JPG',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ];

  get recipes(): Recipe[] {
    return [...this._recipes]; // return a copy of array
  }

  constructor() { }

  getRecipe(recipeId: string): Recipe {
    return {...this._recipes.find(recipe => recipe.id === recipeId)};
  }

  deleteRecipe(recipeId: string): void {
    this._recipes = this._recipes.filter(recipe => recipe.id !== recipeId);
  }
}
