export interface PotionAttributes {
  slug: string;
  name: string;
  characteristics: string | null;
  difficulty: string | null;
  effect: string | null;
  image: string | null;
  inventors: string | null;
  ingredients: string | null;
  manufacturers: string | null;
  side_effects: string | null;
  time: string | null;
  wiki: string | null;
}

export interface PotionResource {
  id: string;
  type: string;
  attributes: PotionAttributes;
}

/** GET /v1/potions → a LIST of potions, one page at a time (max 100 per page). */
export interface PotionsResponse {
  data: PotionResource[];
  meta: {
    pagination: { current: number; last?: number; records: number };
  };
}

/** GET /v1/potions/:id → a SINGLE potion. Note `data` is an object here, not an array. */
export interface PotionResponse {
  data: PotionResource;
}

/**
 * What the pages actually use: the attributes plus the id, flattened.
 * `&` is an "intersection type": everything in PotionAttributes AND an id.
 */
export type Potion = PotionAttributes & { id: string };
