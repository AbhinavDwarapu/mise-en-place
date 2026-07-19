# Kitchen data model

```mermaid
classDiagram
  direction LR

  class Ingredient {
    id: string
    name: string
    category: IngredientCategory
    quantity: Quantity
    expiresAfterMs: number | null
    addedAtIso: string
    substitutions: string[]
  }

  class ShoppingListItem {
    id: string
    name: string
    quantity: Quantity
    addedAtIso: string
  }

  class Quantity {
    amount: number
    unit: string
  }

  class Recipe {
    id: string
    name: string
    color: string
    servings: number
    ingredients: RecipeIngredient[]
  }

  class RecipeIngredient {
    source: RecipeIngredientSource
    needed: Quantity
  }

  class RecipeIngredientSource {
    <<union>>
    kitchen: ingredientId
    shopping-list: shoppingListItemId
  }

  class IngredientCategory {
    <<union>>
    produce
    dairy
    meat
    bakery
    frozen
    pantry
    other
  }

  Ingredient "1" *-- "1" Quantity : quantity
  ShoppingListItem "1" *-- "1" Quantity : quantity
  Recipe "1" *-- "*" RecipeIngredient : ingredients
  RecipeIngredient "1" *-- "1" Quantity : needed
  RecipeIngredient "1" --> "1" RecipeIngredientSource : source
  RecipeIngredientSource "*" ..> "0..1" Ingredient : ingredientId
  RecipeIngredientSource "*" ..> "0..1" ShoppingListItem : shoppingListItemId
  Ingredient --> IngredientCategory : category
```

## Semantics the diagram cannot show

- **Expiry** is a duration, not a date: an ingredient expires at
  `addedAtIso + expiresAfterMs`. `null` means it never expires.
- **Quantity's `unit`** is free text (`g`, `bag`, `tub`). `Quantity` lives in
  `shared/types.ts` since both `Ingredient`/`RecipeIngredient` (kitchen) and
  `ShoppingListItem` (shopping list) need it.
- **`substitutions`** are free-text names ("frozen spinach", "kale"), not
  links to other `Ingredient` records. An ingredient can list a substitute
  that is not in the kitchen.
- **`RecipeIngredientSource`** is a tagged union, not a class with both
  fields present at once:
  `{ kind: 'kitchen'; ingredientId: string } | { kind: 'shopping-list';
  shoppingListItemId: string }`. A recipe ingredient you already have in
  your kitchen points at an `Ingredient`; one you don't have yet points at a
  `ShoppingListItem`. Nothing is faked into the kitchen just because a
  recipe needs it — the source tells you which bucket it's really in.
- **Deleting a recipe never cascades.** It only removes the `Recipe`. Any
  `Ingredient` or `ShoppingListItem` it referenced stays exactly as it was,
  even if no other recipe references it anymore — that case is only
  surfaced as an informational warning before the delete (see
  `docs/architecture.md` for where that logic lives:
  `kitchen/logic/recipe-usage.ts`).
- **`ShoppingListItem`** lives in `shared/state/shopping-list-store.ts`, not
  inside the `kitchen` feature, because the `kitchen` feature (recipe
  ingredients) needs to read it and features never import each other. There
  is no shopping-list screen yet — the store exists only to back recipe
  ingredient selection.
