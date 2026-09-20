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

export interface PotionsResponse {
  data: PotionResource[];
}
