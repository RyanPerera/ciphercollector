import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import CardResults from "./components/CardTable";
import CardPagination from "./components/CardPagination";
import CardFilters from "./components/CardFilters";
import supabase from "./supabase";
import Header from "./components/Header";
import { Footer } from "./components/footer";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import { CollectionFilter, useCardQuery } from "./hooks/useCardQuery";

interface CollectionEntry {
  id: number;
  card: number | string | null;
  amount: number | null;
}

interface WishlistEntry {
  id: number;
  card: number | string | null;
}

function App() {
  const { user, uid } = useAuth();
  const queryClient = useQueryClient();

  // Pagination and filter state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [set, setSet] = useState("");
  const [rarity, setRarity] = useState("");
  const [colour, setColour] = useState("");
  const [collectionFilter, setCollectionFilter] =
    useState<CollectionFilter>("all");
  const [inWishlistOnly, setInWishlistOnly] = useState(false);

  // Fetch user's collection
  const { data: collectionData = [], isLoading: isCollectionLoading } =
    useQuery({
      queryKey: ["collection", uid],
      queryFn: async (): Promise<CollectionEntry[]> => {
        if (!uid) return [];
        const { data, error } = await supabase
          .from("collections")
          .select("id, card, amount")
          .eq("user", uid);

        if (error) {
          throw new Error(error.message);
        }

        return data || [];
      },
      enabled: !!uid,
    });

  const collectionCardIds = useMemo(
    () =>
      collectionData
        .filter((item) => item.card !== null)
        .map((item) => String(item.card)),
    [collectionData],
  );

  const collectionAmounts = useMemo(
    () =>
      new Map(
        collectionData
          .filter((item) => item.card !== null)
          .map((item) => [String(item.card), item.amount ?? 0]),
      ),
    [collectionData],
  );

  // Fetch user's wishlist
  const { data: wishlistData = [], isLoading: isWishlistLoading } = useQuery({
    queryKey: ["wishlist", uid],
    queryFn: async (): Promise<WishlistEntry[]> => {
      if (!uid) return [];
      const { data, error } = await supabase
        .from("wishlist")
        .select("id, card")
        .eq("user", uid);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!uid,
  });

  const wishlistCardIds = useMemo(
    () =>
      wishlistData
        .filter((item) => item.card !== null)
        .map((item) => String(item.card)),
    [wishlistData],
  );

  const wishlistIds = useMemo(
    () => new Set(wishlistCardIds),
    [wishlistCardIds],
  );

  const shouldWaitForCollectionFilter =
    !!uid && collectionFilter !== "all" && isCollectionLoading;
  const shouldWaitForWishlistFilter =
    !!uid && inWishlistOnly && isWishlistLoading;

  // Fetch cards with TanStack Query (refetch on filter changes)
  const { data: cardQueryData, isLoading: cardsLoading } = useCardQuery({
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
    enabled: !shouldWaitForCollectionFilter && !shouldWaitForWishlistFilter,
  });

  const cards = cardQueryData?.cards ?? [];
  const totalCount = cardQueryData?.totalCount ?? 0;

  useEffect(() => {
    setPage(0);
  }, [search, set, rarity, colour, collectionFilter, inWishlistOnly]);

  // Collection mutations
  const refreshCollectionState = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["collection", uid] }),
      queryClient.invalidateQueries({ queryKey: ["wishlist", uid] }),
      queryClient.invalidateQueries({ queryKey: ["cards"] }),
    ]);
  };

  const updateCollectionAmount = async (
    userId: string,
    cardId: string,
    delta: number,
  ) => {
    if (!userId || !cardId || delta === 0) return;

    const { data: existingEntry, error: fetchError } = await supabase
      .from("collections")
      .select("id, amount")
      .eq("user", userId)
      .eq("card", Number(cardId))
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const nextAmount = (existingEntry?.amount ?? 0) + delta;

    if (!existingEntry && nextAmount > 0) {
      const { error: insertError } = await supabase
        .from("collections")
        .insert({ user: userId, card: Number(cardId), amount: nextAmount });

      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    if (existingEntry && nextAmount > 0) {
      const { error: updateError } = await supabase
        .from("collections")
        .update({ amount: nextAmount })
        .eq("id", existingEntry.id);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }

    if (existingEntry && nextAmount <= 0) {
      const { error: deleteError } = await supabase
        .from("collections")
        .delete()
        .eq("id", existingEntry.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }
    }

    await refreshCollectionState();
  };

  const addToCollection = async (userId: string, cardId: string) =>
    updateCollectionAmount(userId, cardId, 1);

  const removeFromCollection = async (userId: string, cardId: string) =>
    updateCollectionAmount(userId, cardId, -1);

  const toggleWishlist = async (userId: string, cardId: string) => {
    if (!userId || !cardId) return;

    const { data: existingEntry, error: fetchError } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user", userId)
      .eq("card", Number(cardId))
      .maybeSingle();

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (existingEntry) {
      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", existingEntry.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }
    } else {
      const { error: insertError } = await supabase
        .from("wishlist")
        .insert({ user: userId, card: Number(cardId) });

      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    await refreshCollectionState();
  };

  // Auth handlers
  const login = async (provider: string) => {
    const redirectTo = `${window.location.origin}${window.location.pathname}`;

    await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { redirectTo },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <TooltipProvider>
      <div className="app">
        <Header
          name={user?.user_metadata?.full_name}
          googleLogin={() => login("google")}
          githubLogin={() => login("github")}
          logout={logout}
        />

        <CardFilters
          search={search}
          setSearch={setSearch}
          set={set}
          setSet={setSet}
          colour={colour}
          setColour={setColour}
          rarity={rarity}
          setRarity={setRarity}
          collectionFilter={collectionFilter}
          setCollectionFilter={setCollectionFilter}
          inWishlistOnly={inWishlistOnly}
          setInWishlistOnly={setInWishlistOnly}
        />

        <CardPagination
          page={page}
          setPage={setPage}
          totalCount={totalCount}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
        <CardResults
          cards={cards}
          userId={uid}
          collectionAmounts={collectionAmounts}
          wishlistIds={wishlistIds}
          onAddToCollection={(cardId) => addToCollection(uid, cardId)}
          onRemoveFromCollection={(cardId) => removeFromCollection(uid, cardId)}
          onToggleWishlist={(cardId) => toggleWishlist(uid, cardId)}
          rowsPerPage={rowsPerPage}
          isLoading={
            (shouldWaitForCollectionFilter ||
              shouldWaitForWishlistFilter ||
              cardsLoading) &&
            cards.length === 0
          }
        />

        <Footer />
      </div>
    </TooltipProvider>
  );
}

export default App;
