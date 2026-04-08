import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import CardResults from "./components/CardTable";
import CardPagination from "./components/CardPagination";
import CardFilters from "./components/CardFilters";
import supabase from "./supabase";
import Header from "./components/Header";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import { useCardQuery } from "./hooks/useCardQuery";

const url =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/"
    : "https://ryanperera.github.io/ciphercollector/";

function App() {
  const { user, uid } = useAuth();

  // Pagination and filter state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [search, setSearch] = useState("");
  const [set, setSet] = useState("");
  const [rarity, setRarity] = useState("");
  const [colour, setColour] = useState("");

  // Fetch cards with TanStack Query (refetch on filter changes)
  const { data: cardQueryData, isLoading: cardsLoading } = useCardQuery({
    search,
    set,
    rarity,
    colour,
    page,
    rowsPerPage,
  });

  const cards = cardQueryData?.cards ?? [];
  const totalCount = cardQueryData?.totalCount ?? 0;

  // Fetch user's collection
  const { data: collectionData = [] } = useQuery({
    queryKey: ["collection", uid],
    queryFn: async () => {
      if (!uid) return [];
      const { data } = await supabase
        .from("collections")
        .select("card")
        .eq("user", uid);
      return data || [];
    },
    enabled: !!uid,
  });

  const collectionIds = useMemo(
    () => new Set(collectionData.map((item) => item.card)),
    [collectionData],
  );

  useEffect(() => {
    setPage(0);
  }, [search, set, rarity, colour]);

  // Collection mutations
  const addToCollection = async (userId: string, cardId: string) => {
    if (!userId) return;
    await supabase.from("collections").insert([{ user: userId, card: cardId }]);
  };

  const removeFromCollection = async (userId: string, cardId: string) => {
    if (!userId) return;
    await supabase
      .from("collections")
      .delete()
      .eq("user", userId)
      .eq("card", cardId);
  };

  // Auth handlers
  const login = async (provider: string) => {
    await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { redirectTo: url },
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
          collectionIds={collectionIds}
          onAddToCollection={(cardId) => addToCollection(uid, cardId)}
          onRemoveFromCollection={(cardId) => removeFromCollection(uid, cardId)}
          rowsPerPage={rowsPerPage}
          isLoading={cardsLoading && cards.length === 0}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
