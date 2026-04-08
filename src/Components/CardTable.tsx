import { memo, useState } from "react";
import BasicModal from "./BasicModal";
import { Skeleton } from "./ui/skeleton";
import type { Card } from "../hooks/useCardQuery";

interface CardResultsProps {
  cards: Card[];
  userId: string;
  collectionIds: Set<string>;
  onAddToCollection: (id: string) => void;
  onRemoveFromCollection: (id: string) => void;
  rowsPerPage: number;
  isLoading: boolean;
}

function CardSlotSkeleton() {
  return (
    <div className="flex flex-row p-0.5">
      <Skeleton className="w-[10vh] h-[14.3vh] rounded-sm bg-zinc-300" />
    </div>
  );
}

export default memo(function CardResults({
  cards,
  userId,
  collectionIds,
  onAddToCollection,
  onRemoveFromCollection,
  rowsPerPage,
  isLoading,
}: CardResultsProps) {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const slotCount = isLoading ? Math.max(1, rowsPerPage) : cards.length;

  return (
    <div className="pt-4 pb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-10">
      {isLoading
        ? Array.from({ length: slotCount }, (_, index) => (
            <CardSlotSkeleton key={`skeleton-${index}`} />
          ))
        : cards.map((card) => (
            <BasicModal
              key={card.id}
              id={card.id}
              name={card.Name}
              set={card.Set}
              color={card.Color}
              rarity={card.Rarity}
              num={card.Imagefile}
              url={card.imagefiledb.Url}
              skill1={card.Skill1}
              skill2={card.Skill2}
              skill3={card.Skill3}
              skill4={card.Skill4}
              user={userId}
              have={collectionIds.has(card.id)}
              removeCard={() => onRemoveFromCollection(card.id)}
              addCard={() => onAddToCollection(card.id)}
              allCards={cards}
              isOpen={openCardId === card.id}
              onOpenCard={(cardId) => setOpenCardId(cardId)}
              onCloseCard={() => setOpenCardId(null)}
            />
          ))}
    </div>
  );
});
