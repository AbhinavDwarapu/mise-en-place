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

  class Quantity {
    amount: number
    unit: string
  }

  class Recipe {
    id: string
    name: string
    color: string
    ingredients: RecipeIngredient[]
  }

  class RecipeIngredient {
    ingredientId: string
    needed: Quantity
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
  Recipe "1" *-- "*" RecipeIngredient : ingredients
  RecipeIngredient "1" *-- "1" Quantity : needed
  RecipeIngredient "*" --> "1" Ingredient : ingredientId
  Ingredient --> IngredientCategory : category
```

## Semantics the diagram cannot show

- **Expiry** is a duration, not a date: an ingredient expires at
  `addedAtIso + expiresAfterMs`. `null` means it never expires.
- **Quantity's `unit`** is free text (`g`, `bag`, `tub`).
- **`substitutions`** are free-text names ("frozen spinach", "kale"), not
  links to other `Ingredient` records. An ingredient can list a substitute
  that is not in the kitchen.