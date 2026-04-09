import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

import AUTO from "../Assets/skillbuttons/AUTO.png";
import Activate from "../Assets/skillbuttons/Activate.png";
import Continuous from "../Assets/skillbuttons/Continuous.png";
import AwakeningSkill from "../Assets/skillbuttons/AwakeningSkill.png";
import BondSkill from "../Assets/skillbuttons/BondSkill.png";
import CarnageForm from "../Assets/skillbuttons/CarnageForm.png";
import CCS from "../Assets/skillbuttons/CCS.png";
import CrestPower from "../Assets/skillbuttons/CrestPower.png";
import DragonBlood from "../Assets/skillbuttons/DragonBlood.png";
import FormationSkill from "../Assets/skillbuttons/FormationSkill.png";
import HeroSkill from "../Assets/skillbuttons/HeroSkill.png";
import IncreaseSkill from "../Assets/skillbuttons/IncreaseSkill.png";
import LegendaryItemSkill from "../Assets/skillbuttons/LegendaryItemSkill.png";
import LvSX from "../Assets/skillbuttons/LvSX.png";
import OncePerTurn from "../Assets/skillbuttons/OncePerTurn.png";
import Support from "../Assets/skillbuttons/Support.png";
import Flip1 from "../Assets/skillbuttons/Flip1.png";
import Flip2 from "../Assets/skillbuttons/Flip2.png";
import Flip3 from "../Assets/skillbuttons/Flip3.png";
import Tap from "../Assets/skillbuttons/Tap.png";
import AtkDef from "../Assets/skillbuttons/AtkDef.png";
import AttackSupport from "../Assets/skillbuttons/AttackSupport.png";
import DefenseSupport from "../Assets/skillbuttons/DefenseSupport.png";
import TwinSkill from "../Assets/skillbuttons/TwinSkill.png";
import UnionSkill from "../Assets/skillbuttons/UnionSkill.png";
import Hover from "./Hover";
import { H1, H2, Lead, Muted, P } from "@/components/ui/typography";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

type SkillToken =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: string }
  | { kind: "img"; src: string; label: string };

function getThumbnailFallbackUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    // Supabase storage image transform endpoint
    if (parsedUrl.pathname.includes("/storage/v1/object/public/")) {
      parsedUrl.pathname = parsedUrl.pathname.replace(
        "/storage/v1/object/public/",
        "/storage/v1/render/image/public/",
      );
      parsedUrl.searchParams.set("width", "180");
      parsedUrl.searchParams.set("quality", "45");
      return parsedUrl.toString();
    }

    return url;
  } catch {
    return url;
  }
}

const skillButtonMap: { pattern: RegExp; src: string; label: string }[] = [
  { pattern: /\|AUTO\|/gi, src: AUTO, label: "AUTO" },
  { pattern: /\|ACT\|/gi, src: Activate, label: "ACT" },
  { pattern: /\|CONT\|/gi, src: Continuous, label: "CONT" },
  {
    pattern: /\|AWAKENING SKILL\||\[AWAKENING SKILL\]|\[AS\]|\|AS\|/gi,
    src: AwakeningSkill,
    label: "Awakening Skill",
  },
  {
    pattern: /\|BOND SKILL\||\[BOND SKILL\]|\[BS\]|\|BS\|/gi,
    src: BondSkill,
    label: "Bond Skill",
  },
  {
    pattern: /\|CARNAGE FORM\||\[CARNAGE FORM\]|\[CF\]|\|CF\|/gi,
    src: CarnageForm,
    label: "Carnage Form",
  },
  { pattern: /\|CCS\|/gi, src: CCS, label: "CCS" },
  { pattern: /\[CCS\]/gi, src: CCS, label: "CCS" },
  {
    pattern: /\|CREST POWER\||\[CREST POWER\]|\[CP\]|\|CP\|/gi,
    src: CrestPower,
    label: "Crest Power",
  },
  {
    pattern: /\|DRAGON BLOOD\||\[DRAGON BLOOD\]|\[DB\]|\|DB\|/gi,
    src: DragonBlood,
    label: "Dragon Blood",
  },
  {
    pattern: /\|FORMATION SKILL\||\[FORMATION SKILL\]|\[FS\]|\|FS\|/gi,
    src: FormationSkill,
    label: "Formation Skill",
  },
  { pattern: /\[HS\]/gi, src: HeroSkill, label: "Hero Skill" },
  {
    pattern: /\|INCREASE SKILL\||\[INCREASE SKILL\]|\[IS\]|\|IS\|/gi,
    src: IncreaseSkill,
    label: "Increase Skill",
  },
  {
    pattern:
      /\|LEGENDARY ITEM SKILL\||\[LEGENDARY ITEM SKILL\]|\[LIS\]|\|LIS\|/gi,
    src: LegendaryItemSkill,
    label: "Legendary Item Skill",
  },
  {
    pattern: /\|LVS ?X\||\[LVS ?X\]|\[LVSX\]|\|LVSX\|/gi,
    src: LvSX,
    label: "Level Up Skill",
  },
  { pattern: /\[Once Per Turn\]/gi, src: OncePerTurn, label: "Once Per Turn" },
  {
    pattern: /\|SUPP\||\[SUPP\]|\[SUPPORT\]|\|SUPPORT\|/gi,
    src: Support,
    label: "SUPPORT",
  },
  {
    pattern: /Flip 1 Bond face-down/gi,
    src: Flip1,
    label: "Flip 1 Bond face-down",
  },
  {
    pattern: /Flip 2 Bonds face-down/gi,
    src: Flip2,
    label: "Flip 2 Bonds face-down",
  },
  {
    pattern: /Flip 3 Bonds face-down/gi,
    src: Flip3,
    label: "Flip 3 Bonds face-down",
  },
  { pattern: /Tap this unit/gi, src: Tap, label: "Tap this unit" },
  { pattern: /\|ATK\/DEF SUPP\|/gi, src: AtkDef, label: "ATK/DEF SUPP" },
  { pattern: /\|ATK SUPP\|/gi, src: AttackSupport, label: "ATK SUPP" },
  { pattern: /\|DEF SUPP\|/gi, src: DefenseSupport, label: "DEF SUPP" },
  {
    pattern: /\|TWIN SKILL\||\[TWIN SKILL\]|\[TS\]|\|TS\|/gi,
    src: TwinSkill,
    label: "Twin Skill",
  },
  {
    pattern: /\|UNION SKILL\||\[UNION SKILL\]|\[US\]|\|US\|/gi,
    src: UnionSkill,
    label: "Union Skill",
  },
];

function tokenizeSkill(raw: string): SkillToken[] {
  // Some card text stores the title delimiter as a newline followed by a colon.
  // Normalize that shape so title parsing and highlighting remain consistent.
  const normalizedRaw = raw
    .replace(/\r\n/g, "\n")
    .replace(/\n+\s*[:：]\s*/g, ": ");

  const titleSource = normalizedRaw
    .trimStart()
    .replace(/^(?:(?:\[[^\]]*\]|\|[^|]*\|)\s*)+/, "")
    .trimStart();
  const titleMatch =
    titleSource.match(/^([^:|]+?)(?=\s*[:：|])/) ??
    titleSource.match(/^([^:|]+)$/);
  const title = titleMatch?.[1]?.trim() ?? "";

  let tokens: SkillToken[] = [{ kind: "text", value: normalizedRaw }];

  for (const { pattern, src, label } of skillButtonMap) {
    tokens = tokens.flatMap((t) => {
      if (t.kind !== "text") return [t];
      const parts = t.value.split(pattern);
      if (parts.length === 1) return [t];
      return parts.flatMap((part, i): SkillToken[] => [
        ...(part ? [{ kind: "text" as const, value: part }] : []),
        ...(i < parts.length - 1 ? [{ kind: "img" as const, src, label }] : []),
      ]);
    });
  }

  if (title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const titleRe = new RegExp(escaped, "gi");
    tokens = tokens.flatMap((t) => {
      if (t.kind !== "text") return [t];
      const parts = t.value.split(titleRe);
      const matches = t.value.match(titleRe) ?? [];
      if (parts.length === 1) return [t];
      return parts.flatMap((part, i): SkillToken[] => [
        ...(part ? [{ kind: "text" as const, value: part }] : []),
        ...(i < parts.length - 1
          ? [{ kind: "bold" as const, value: matches[i] ?? title }]
          : []),
      ]);
    });
  }

  // Remove delimiter artifacts like ': ' that can appear at the start of
  // description segments after title/icon tokenization.
  tokens = tokens
    .map((token, index) => {
      if (token.kind !== "text") return token;

      const shouldStripLeadingDelimiter =
        /^\s*[:：]\s*/.test(token.value) &&
        (index === 0 || tokens[index - 1]?.kind === "bold");

      if (!shouldStripLeadingDelimiter) return token;

      return {
        ...token,
        value: token.value.replace(/^\s*[:：]\s*/, ""),
      };
    })
    .filter((token) => token.kind !== "text" || token.value.length > 0);

  return tokens;
}

export default function BasicModal(props: {
  id: string;
  name: string;
  set: string;
  color: string;
  rarity: string;
  num: string;
  url: string;
  skill1: string;
  skill2: string;
  skill3: string;
  skill4: string;
  user: string;
  amount: number;
  isWishlisted: boolean;
  removeCard: () => Promise<void>;
  addCard: () => Promise<void>;
  toggleWishlist: () => Promise<void>;
  allCards: any[];
  isOpen: boolean;
  onOpenCard: (cardId: string) => void;
  onCloseCard: () => void;
}) {
  const [foil, setFoil] = useState(false);
  const [holo, setHolo] = useState(false);
  const [noise, setNoise] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [isUpdatingCollection, setIsUpdatingCollection] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);
  const modalFallbackUrl = getThumbnailFallbackUrl(props.url);

  useEffect(() => {
    setThumbnailLoaded(false);
  }, [props.url]);

  useEffect(() => {
    if (!props.isOpen) {
      setModalImageLoaded(false);
      return;
    }

    let isCancelled = false;
    const preloadedImage = new Image();
    preloadedImage.src = props.url;
    preloadedImage.onload = () => {
      if (!isCancelled) setModalImageLoaded(true);
    };
    preloadedImage.onerror = () => {
      if (!isCancelled) setModalImageLoaded(true);
    };

    return () => {
      isCancelled = true;
    };
  }, [props.isOpen, props.url]);

  const setEffects = () => {
    switch (props.rarity) {
      case "SR+":
      case "SR":
      case "ST+":
      case "R+":
      case "HNX":
      case "R+X":
      case "N+X":
      case "+X":
      case "PR+":
        setFoil(true);
        setHolo(true);
        setNoise(true);
        break;
      case "R":
      case "HR":
      case "PRr":
        setFoil(false);
        setHolo(true);
        setNoise(true);
        break;
      default:
        setFoil(false);
        setHolo(false);
        setNoise(false);
        break;
    }
  };

  const handleOpen = () => {
    props.onOpenCard(props.id);
  };

  useEffect(() => {
    if (props.isOpen) {
      setEffects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen, props.id, props.rarity]);

  const handleNavigateLeft = () => {
    const currentIndex = props.allCards.findIndex((c) => c.id === props.id);
    if (currentIndex > 0) {
      props.onOpenCard(props.allCards[currentIndex - 1].id);
    }
  };

  const handleNavigateRight = () => {
    const currentIndex = props.allCards.findIndex((c) => c.id === props.id);
    if (currentIndex < props.allCards.length - 1) {
      props.onOpenCard(props.allCards[currentIndex + 1].id);
    }
  };

  const hasLeft =
    props.isOpen && props.allCards.findIndex((c) => c.id === props.id) > 0;
  const hasRight =
    props.isOpen &&
    props.allCards.findIndex((c) => c.id === props.id) <
      props.allCards.length - 1;

  const handleModalKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" && hasLeft) {
      event.preventDefault();
      handleNavigateLeft();
    }

    if (event.key === "ArrowRight" && hasRight) {
      event.preventDefault();
      handleNavigateRight();
    }
  };

  let name = props.name.split(",");
  name[1] = name[1].trimStart();
  const num = props.num.split("_")[0].replace("plus", "+");

  const inCollection = props.amount > 0;

  const handleCollectionChange = async (action: () => Promise<void>) => {
    if (!props.user || isUpdatingCollection) return;

    setIsUpdatingCollection(true);

    try {
      await action();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingCollection(false);
    }
  };

  const handleWishlistToggle = async (
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event?.stopPropagation();
    if (!props.user || isUpdatingWishlist) return;

    setIsUpdatingWishlist(true);

    try {
      await props.toggleWishlist();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  function SkillText({ text }: { text: string }) {
    const tokens = tokenizeSkill(text);
    return (
      <P>
        {tokens.map((t, i) => {
          if (t.kind === "img")
            return (
              <img
                key={i}
                src={t.src}
                alt={t.label}
                title={t.label}
                className="inline-block align-middle h-7 w-auto object-contain"
              />
            );
          if (t.kind === "bold")
            return (
              <Lead key={i} className="text-primary">
                {t.value}
              </Lead>
            );
          return <span key={i}>{t.value}</span>;
        })}
      </P>
    );
  }

  return (
    <div className="flex flex-row">
      <div className="relative h-[14.3vh] w-[10vh]" onClick={handleOpen}>
        <button
          type="button"
          aria-label={
            props.isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          title={
            props.isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          className={`absolute right-1 top-1 z-20 rounded-full p-1 transition-colors ${props.isWishlisted ? "bg-yellow-100 text-yellow-500" : "bg-zinc-100/90 text-zinc-400"}`}
          onClick={handleWishlistToggle}
          disabled={isUpdatingWishlist}
        >
          <Bookmark
            className="size-4"
            fill={props.isWishlisted ? "currentColor" : "none"}
          />
        </button>
        {!thumbnailLoaded && (
          <Skeleton className="absolute inset-0 h-[14.3vh] w-[10vh] rounded-sm bg-zinc-300" />
        )}
        <img
          src={props.url}
          alt={props.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setThumbnailLoaded(true)}
          onError={() => setThumbnailLoaded(true)}
          className={`absolute inset-0 h-[14.3vh] w-[10vh] object-cover transition-opacity duration-150 ${thumbnailLoaded ? "opacity-100" : "opacity-0"}${inCollection ? "" : " brightness-90 contrast-75"}`}
        />
      </div>
      <Dialog
        open={props.isOpen}
        onOpenChange={(newOpen) => {
          if (newOpen) {
            props.onOpenCard(props.id);
          } else {
            props.onCloseCard();
          }
        }}
      >
        <DialogContent
          className="flex w-[22rem] max-w-[calc(100vw-1rem)] h-auto max-h-[calc(100vh-1rem)] flex-col items-center gap-4 overflow-y-auto md:overflow-visible rounded-2xl border border-zinc-300 bg-zinc-100 p-4 md:w-[92vw] md:max-w-[1120px] md:max-h-[90vh] md:flex-row md:items-start md:gap-10 md:p-6"
          onKeyDown={handleModalKeyDown}
          showCloseButton={true}
        >
          <DialogTitle className="sr-only">{props.name}</DialogTitle>
          <button
            type="button"
            tabIndex={0}
            aria-label="Modal focus target"
            className="sr-only focus:outline-none focus-visible:ring-0"
          />

          <div className="relative shrink-0 self-center md:self-start">
            <Hover>
              <div className="relative h-80 w-[14rem] rounded-[14px] md:h-[431px] md:w-[308px] overflow-hidden">
                <div className="absolute z-[99] block h-80 w-[14rem] rounded-[14px] md:h-[431px] md:w-[308px]">
                  {foil && <div className="foil" />}
                  {noise && <div className="noise" />}
                  {holo && <div className="holo" />}
                </div>
                <img
                  src={modalFallbackUrl}
                  alt={props.name}
                  className={`absolute inset-0 h-80 w-[14rem] rounded-[14px] object-cover md:h-[431px] md:w-[308px] transition-opacity duration-200 ${modalImageLoaded ? "opacity-0" : "opacity-100"}`}
                />
                <img
                  src={props.url}
                  alt={props.name}
                  loading="eager"
                  decoding="async"
                  onLoad={() => setModalImageLoaded(true)}
                  onError={() => setModalImageLoaded(true)}
                  className={`absolute inset-0 h-80 w-[14rem] rounded-[14px] object-cover md:h-[431px] md:w-[308px] transition-opacity duration-200 ${modalImageLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            </Hover>
          </div>

          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto pr-1 md:max-h-[80vh]">
            <div className="mb-5 flex flex-col gap-3">
              <H1>{name[0]}</H1>
              <H2>{name[1]}</H2>
            </div>

            <div className="flex flex-row gap-1.5 flex-wrap items-center">
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="secondary"
                    className="h-12 rounded-sm border-[3px] border-[#0F7391] bg-primary-foreground px-2.5  text-white "
                  >
                    <Lead>{props.set}</Lead>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <Muted>Set</Muted>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="h-12 rounded-sm border-[3px] border-[#0F7391] bg-primary-foreground px-2.5  text-white "
                  >
                    <Lead>{num}</Lead>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <Muted>Card Number</Muted>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className="h-12 rounded-sm border-[3px] border-[#0F7391] bg-white px-2.5  text-black "
                  >
                    <Lead>{props.rarity}</Lead>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <Muted>Rarity</Muted>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="mt-4 self-start inline-flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`bg-white inline-flex h-8 w-8 rounded-full border-[3px] transition duration-100 ${props.isWishlisted ? "border-yellow-500 text-yellow-600 hover:border-yellow-500 hover:text-yellow-600" : "border-zinc-300 text-zinc-500 hover:border-yellow-500 hover:text-yellow-600"}`}
                    disabled={isUpdatingWishlist}
                    onClick={handleWishlistToggle}
                  >
                    <Bookmark
                      className="size-4"
                      fill={props.isWishlisted ? "currentColor" : "none"}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {props.isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"}
                </TooltipContent>
              </Tooltip>
              {inCollection ? (
                <div className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#43da43] bg-white px-2 py-1 text-[#43da43]">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full border border-[#43da43] text-[#43da43] hover:bg-[#43da43]/10 hover:text-[#43da43]"
                        disabled={isUpdatingCollection}
                        onClick={() => handleCollectionChange(props.removeCard)}
                      >
                        <Minus className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Remove one from Collection
                    </TooltipContent>
                  </Tooltip>

                  <div className="flex min-w-24 items-center justify-center gap-2 px-2">
                    <Muted className="m-0 text-inherit">
                      {props.amount} in Collection
                    </Muted>
                  </div>

                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-full border border-[#43da43] text-[#43da43] hover:bg-[#43da43]/10 hover:text-[#43da43]"
                        disabled={isUpdatingCollection}
                        onClick={() => handleCollectionChange(props.addCard)}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Add one to Collection
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="outline"
                      className="bg-white inline-flex h-8 items-center gap-1 rounded-full border-[3px] border-zinc-300 px-4 leading-none text-zinc-500 transition duration-100 hover:border-[#43da43] hover:text-[#43da43]"
                      disabled={isUpdatingCollection}
                      onClick={() => handleCollectionChange(props.addCard)}
                    >
                      <CheckCircle className="relative top-px size-4" />
                      <Muted className="m-0 text-inherit">
                        Add to Collection
                      </Muted>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Add to Collection</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="my-7 space-y-4 text-[2.1rem] leading-[1.45]">
              {props.skill1 !== "-" && <SkillText text={props.skill1} />}
              {props.skill2 !== "-" && <SkillText text={props.skill2} />}
              {props.skill3 !== "-" && <SkillText text={props.skill3} />}
              {props.skill4 !== "-" && <SkillText text={props.skill4} />}
            </div>
          </div>

          {/* Navigation Arrows - Absolute Bottom Right */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-50">
            {hasLeft && (
              <button
                onClick={handleNavigateLeft}
                className="p-1 hover:opacity-70 transition-opacity"
                aria-label="Previous card"
              >
                <ChevronLeft className="size-10 text-gray-600" />
              </button>
            )}
            {hasRight && (
              <button
                onClick={handleNavigateRight}
                className="p-1 hover:opacity-70 transition-opacity"
                aria-label="Next card"
              >
                <ChevronRight className="size-10 text-gray-600" />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
