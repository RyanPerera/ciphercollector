import { Dispatch, SetStateAction, memo } from "react";
import SearchBar from "./SearchBar";
import MultiBox from "./MultiBox";
import { setSelector, colourSelector, raritySelector } from "./selectOptions";
import { Button } from "./ui/button";
import type { CollectionFilter } from "../hooks/useCardQuery";

interface CardFiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  set: string;
  setSet: Dispatch<SetStateAction<string>>;
  colour: string;
  setColour: Dispatch<SetStateAction<string>>;
  rarity: string;
  setRarity: Dispatch<SetStateAction<string>>;
  collectionFilter: CollectionFilter;
  setCollectionFilter: Dispatch<SetStateAction<CollectionFilter>>;
  inWishlistOnly: boolean;
  setInWishlistOnly: Dispatch<SetStateAction<boolean>>;
}

function CardFilters({
  search,
  setSearch,
  set,
  setSet,
  colour,
  setColour,
  rarity,
  setRarity,
  collectionFilter,
  setCollectionFilter,
  inWishlistOnly,
  setInWishlistOnly,
}: CardFiltersProps) {
  const handleResetAll = () => {
    setSearch("");
    setSet("");
    setColour("");
    setRarity("");
    setCollectionFilter("all");
    setInWishlistOnly(false);
  };

  const hasFilters =
    search ||
    set ||
    colour ||
    rarity ||
    collectionFilter !== "all" ||
    inWishlistOnly;

  return (
    <div className="flex mx-auto flex-row gap-3 flex-wrap bg-white border-3 border-gray-400 mt-4vh p-5 w-4/5 rounded-lg justify-center items-center">
      <SearchBar search={search} setSearch={setSearch} />
      <MultiBox
        label="Set"
        selector={setSelector}
        width={300}
        set={set}
        setSet={setSet}
        colour={colour}
        setColour={setColour}
        rarity={rarity}
        setRarity={setRarity}
      />
      <MultiBox
        label="Colour"
        selector={colourSelector}
        width={300}
        set={set}
        setSet={setSet}
        colour={colour}
        setColour={setColour}
        rarity={rarity}
        setRarity={setRarity}
      />
      <MultiBox
        label="Rarity"
        selector={raritySelector}
        width={300}
        set={set}
        setSet={setSet}
        colour={colour}
        setColour={setColour}
        rarity={rarity}
        setRarity={setRarity}
      />
      <fieldset className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2">
        <legend className="px-1 text-sm text-muted-foreground">
          Collection
        </legend>

        <label className="inline-flex items-center gap-1.5 text-sm">
          <input
            type="radio"
            name="collection-filter"
            value="all"
            checked={collectionFilter === "all"}
            onChange={() => setCollectionFilter("all")}
          />
          All
        </label>

        <label className="inline-flex items-center gap-1.5 text-sm">
          <input
            type="radio"
            name="collection-filter"
            value="in"
            checked={collectionFilter === "in"}
            onChange={() => setCollectionFilter("in")}
          />
          In
        </label>

        <label className="inline-flex items-center gap-1.5 text-sm">
          <input
            type="radio"
            name="collection-filter"
            value="out"
            checked={collectionFilter === "out"}
            onChange={() => setCollectionFilter("out")}
          />
          Out
        </label>
      </fieldset>
      <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={inWishlistOnly}
          onChange={(event) => setInWishlistOnly(event.target.checked)}
        />
        In Wishlist
      </label>
      <Button
        variant="outline"
        disabled={!hasFilters}
        size="sm"
        onClick={handleResetAll}
      >
        Reset Filters
      </Button>
    </div>
  );
}

export default memo(CardFilters);
