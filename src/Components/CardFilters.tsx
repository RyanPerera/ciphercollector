import { Dispatch, SetStateAction, memo } from "react";
import SearchBar from "./SearchBar";
import MultiBox from "./MultiBox";
import { setSelector, colourSelector, raritySelector } from "./selectOptions";
import { Button } from "./ui/button";

interface CardFiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  set: string;
  setSet: Dispatch<SetStateAction<string>>;
  colour: string;
  setColour: Dispatch<SetStateAction<string>>;
  rarity: string;
  setRarity: Dispatch<SetStateAction<string>>;
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
}: CardFiltersProps) {
  const handleResetAll = () => {
    setSearch("");
    setSet("");
    setColour("");
    setRarity("");
  };

  const hasFilters = search || set || colour || rarity;

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
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={handleResetAll}>
          Reset Filters
        </Button>
      )}
    </div>
  );
}

export default memo(CardFilters);
