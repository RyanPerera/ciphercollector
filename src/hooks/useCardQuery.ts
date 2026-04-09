import { keepPreviousData, useQuery } from "@tanstack/react-query";
import supabase from "../supabase";

export interface Card {
  id: string;
  Name: string;
  Set: string;
  Color: string;
  Rarity: string;
  Imagefile: string;
  imagefiledb: { Url: string };
  Class: string;
  Type: string;
  Range: string;
  Attack: string;
  Support: string;
  Skill1: string;
  Skill2: string;
  Skill3: string;
  Skill4: string;
}

export type CollectionFilter = "all" | "in" | "out";

interface UseCardQueryParams {
  search: string;
  set: string;
  rarity: string;
  colour: string;
  collectionFilter: CollectionFilter;
  collectionCardIds: string[];
  inWishlistOnly: boolean;
  wishlistCardIds: string[];
  page: number;
  rowsPerPage: number;
  enabled?: boolean;
}

interface UseCardQueryResult {
  cards: Card[];
  totalCount: number;
}

export function useCardQuery({
  search,
  set,
  rarity,
  colour,
  collectionFilter,
  collectionCardIds,
  inWishlistOnly,
  wishlistCardIds,
  page,
  rowsPerPage,
  enabled = true,
}: UseCardQueryParams) {
  return useQuery({
    queryKey: [
      "cards",
      {
        search,
        set,
        rarity,
        colour,
        collectionFilter,
        collectionCardIds,
        inWishlistOnly,
        wishlistCardIds,
        page,
        rowsPerPage,
      },
    ],
    placeholderData: keepPreviousData,
    enabled,
    queryFn: async (): Promise<UseCardQueryResult> => {
      if (collectionFilter === "in" && collectionCardIds.length === 0) {
        return {
          cards: [],
          totalCount: 0,
        };
      }

      if (inWishlistOnly && wishlistCardIds.length === 0) {
        return {
          cards: [],
          totalCount: 0,
        };
      }

      let query = supabase
        .from("cipherdb")
        .select(
          "id, Name, Set, Color, Rarity, Imagefile, imagefiledb(Url), Class, Type, Range, Attack, Support, Skill1, Skill2, Skill3, Skill4",
          { count: "exact" },
        );

      if (search) {
        query = query.ilike("Name", `%${search}%`);
      }

      if (set) {
        query = query.in("Set", set.split(", "));
      }

      if (rarity) {
        query = query.in("Rarity", rarity.split(", "));
      }

      if (colour) {
        query = query.in("Color", colour.split(", "));
      }

      if (collectionFilter === "in") {
        query = query.in(
          "id",
          collectionCardIds.map((cardId) => Number(cardId)),
        );
      }

      if (collectionFilter === "out" && collectionCardIds.length > 0) {
        query = query.not("id", "in", `(${collectionCardIds.join(",")})`);
      }

      if (inWishlistOnly) {
        query = query.in(
          "id",
          wishlistCardIds.map((cardId) => Number(cardId)),
        );
      }

      if (rowsPerPage > 0) {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage - 1;
        query = query.range(start, end);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Normalize imagefiledb from array to object
      const cards =
        (data as any[])?.map((card) => ({
          ...card,
          id: String(card.id),
          imagefiledb: Array.isArray(card.imagefiledb)
            ? card.imagefiledb[0]
            : card.imagefiledb,
        })) || [];

      return {
        cards,
        totalCount: count ?? 0,
      };
    },
  });
}
