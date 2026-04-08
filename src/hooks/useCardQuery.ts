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

interface UseCardQueryParams {
  search: string;
  set: string;
  rarity: string;
  colour: string;
  page: number;
  rowsPerPage: number;
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
  page,
  rowsPerPage,
}: UseCardQueryParams) {
  return useQuery({
    queryKey: ["cards", { search, set, rarity, colour, page, rowsPerPage }],
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<UseCardQueryResult> => {
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
