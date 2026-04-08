import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function MultiBox(props) {
  const [open, setOpen] = React.useState(false);

  // Determine current value based on props
  const currentValue =
    props.label === "Set"
      ? props.set
      : props.label === "Colour"
        ? props.colour
        : props.rarity;

  const selected = currentValue ? currentValue.split(", ") : [];

  function toggleOption(label) {
    const next = selected.includes(label)
      ? selected.filter((s) => s !== label)
      : [...selected, label];
    const joined = next.join(", ");
    switch (props.label) {
      case "Colour":
        props.setColour(joined);
        break;
      case "Set":
        props.setSet(joined);
        break;
      case "Rarity":
        props.setRarity(joined);
        break;
      default:
        break;
    }
  }

  const displayText =
    selected.length === 0
      ? props.label
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.slice(0, 2).join(", ")} +${selected.length - 2}`;

  const handleSelectAll = () => {
    const allLabels = props.selector.map((option) => option.label);
    const joined = allLabels.join(", ");
    switch (props.label) {
      case "Colour":
        props.setColour(joined);
        break;
      case "Set":
        props.setSet(joined);
        break;
      case "Rarity":
        props.setRarity(joined);
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    switch (props.label) {
      case "Colour":
        props.setColour("");
        break;
      case "Set":
        props.setSet("");
        break;
      case "Rarity":
        props.setRarity("");
        break;
      default:
        break;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            style={{ width: props.width }}
          />
        }
      >
        <span className="truncate">{displayText}</span>
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: props.width }}>
        <div className="flex gap-1 border-b p-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSelectAll}
            className="flex-1 text-xs"
          >
            Select All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="flex-1 text-xs"
          >
            Clear
          </Button>
        </div>
        <Command>
          <CommandInput placeholder={`Search ${props.label}...`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {props.selector.map((option) => (
                <CommandItem
                  key={option.label}
                  onSelect={() => toggleOption(option.label)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      selected.includes(option.label)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
