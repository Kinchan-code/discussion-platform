import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge/badge";
import { Button } from "@/components/ui/button/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPopularTags } from "@/api/home/popular-tags";
import { useGetFilterProtocols } from "@/api/home/protocol-filters";
import { cn } from "@/lib/utils";
import { useFiltersStore } from "@/store/filters-store";

/**
 * Filters Component
 * @description Filters for protocols and discussions
 *
 * components used:
 * - Select
 * - SelectContent
 * - SelectItem
 * - SelectTrigger
 * - SelectValue
 * - Badge
 * - Button
 *
 * @param {Object} props - The properties for the Filters component.
 * @param {string} props.contentType - The type of content to filter (protocols, discussions, or all).
 * @param {function} props.onClick - The function to be called when the button is clicked.
 *
 * @returns {JSX.Element} The Filters component.
 */

interface FiltersProps {
  contentType: "protocols" | "discussions" | "all";
}

function Filters({ contentType }: FiltersProps) {
  const [params, setParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(params.get("sort") || "recent");
  const [filterByProtocols, setFilterByProtocols] = useState(
    params.get("protocol") || ""
  );
  const [filterBy, setFilterBy] = useState(params.get("type") || "all");
  const [activeTag, setActiveTag] = useState(params.get("tags") || "");
  const { isOpenFilter, toggleFilter } = useFiltersStore();

  const { data: popularTags, isFetching: isFetchingPopularTags } =
    useGetPopularTags();
  const { data: filteredProtocols, isFetching: isFetchingFilterProtocols } =
    useGetFilterProtocols();

  const selectData = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "ratings", label: "Highest Rated" },
    { value: "reviews", label: "Most Reviewed" },
  ];

  const getTitle = () => {
    switch (contentType) {
      case "protocols":
        return "Filter Protocols";
      case "discussions":
        return "Filter Discussions";
      default:
        return "Filter Results";
    }
  };

  const handleSortChange = (sort: string) => {
    if (sort === "recent") {
      params.delete("sort");
      setParams(params);
      setSortBy("");
    } else {
      params.set("sort", sort);
      setParams(params);
      setSortBy(sort);
    }
  };

  const handleProtocolChange = (protocol: string) => {
    if (protocol === "all") {
      params.delete("protocol");
      setParams(params);
      setFilterByProtocols("");
      return;
    } else {
      params.set("protocol", protocol);
      setParams(params);
      setFilterByProtocols(protocol);
    }
  };

  const handleTagClick = (tag: string) => {
    if (tag === activeTag) {
      params.delete("tags");
      setParams(params);
      setActiveTag("");
    } else {
      params.set("tags", tag);
      setParams(params);
      setActiveTag(tag);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 flex flex-col gap-2 md:gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm md:text-base text-gray-900">
          {getTitle()}
        </h3>
        {contentType === "protocols" && (
          <Button
            variant="outline"
            onClick={toggleFilter}
            // size='sm'
            className="flex items-center justify-center text-xs md:text-base"
          >
            <SlidersHorizontal className="size-3 md:size-4 text-center" />
            <span className=" font-medium  text-gray-700">
              {isOpenFilter ? "Hide" : "Show"} Filters
            </span>
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex md:items-center flex-col md:flex-row md:gap-2 justify-between w-full">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="max-w-fit text-muted-foreground text-xs md:text-sm border-none shadow-none p-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {selectData.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs md:text-sm"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {contentType === "discussions" && (
            <Select
              value={filterByProtocols}
              onValueChange={handleProtocolChange}
            >
              <SelectTrigger className="max-w-fit text-muted-foreground text-xs md:text-sm border-none shadow-none p-0">
                {isFetchingFilterProtocols ? (
                  <SelectValue placeholder="Loading protocols..." />
                ) : (
                  <SelectValue placeholder="Filter by protocols" />
                )}
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all" className="text-xs md:text-sm">
                  All Protocols
                </SelectItem>
                {filteredProtocols?.data.map((protocol) => (
                  <SelectItem
                    key={protocol.id}
                    value={protocol.id.toString()}
                    className="text-xs md:text-sm"
                  >
                    {protocol.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {contentType === "all" && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{filterByProtocols}</SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {isOpenFilter && contentType === "protocols" && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <span className="text-xs md:text-sm font-medium text-gray-700 mb-2 block">
            Popular Tags:
          </span>
          {isFetchingPopularTags ? (
            <div className="flex flex-wrap gap-2 ">
              <p className="text-muted-foreground text-xs animate-pulse">
                loading popular tags...
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 cursor-pointer">
              {popularTags?.data.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className={cn(
                    "rounded-xl hover:bg-blue-500 text-xs md:text-sm hover:text-white",
                    activeTag === tag.tag && "bg-blue-500 text-white"
                  )}
                  onClick={() => handleTagClick(tag.tag)}
                >
                  {tag.tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { Filters };
