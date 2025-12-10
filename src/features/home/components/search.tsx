import { SearchIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PathName } from "@/enums/path-enums";
import { useSearchDialogStore } from "@/store/search-dialog-store";
import { useGetSearch } from "@/api/search/search";
import { useGetSearchSuggestions } from "@/api/search/search-suggestions";
import { useDebouncedValue } from "@/hooks/user-debounce-value";
import { slugify } from "@/lib/utils";
import type { Protocols } from "@/types/protocols";
import type { Threads } from "@/types/threads";
import type { Tags } from "@/types/tags";

/**
 * Search Component
 * @description Provides a search dialog for protocols and threads. Uses API endpoints for search.
 *
 * components used:
 * - CommandDialog
 * - CommandInput
 * - CommandList
 * - CommandItem
 * - CommandGroup
 * - CommandEmpty
 *
 * @param {string} placeholder - Placeholder text for the search input.
 *
 * @returns {JSX.Element} The Search component.
 * @example
 * <Search placeholder="Search protocols and threads..." />
 */

// Helper function to render highlighted text
function HighlightedText({ text }: { text: string }) {
  // API might return highlighted text with <mark> tags
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: text.replace(
          /<mark>/g,
          '<mark class="bg-yellow-200 text-yellow-900 font-medium">'
        ),
      }}
    />
  );
}

interface SearchProps {
  placeholder?: string;
}

// Interface for search results
interface SearchResult {
  id: string;
  title: string;
  content?: string;
  body?: string;
  author: string;
  tags?: string;
  type: "protocol" | "thread";
  protocol_id?: string;
  // Highlighted versions for search results
  highlightedTitle?: string;
  highlightedContent?: string;
  highlightedAuthor?: string;
}

// Hook for API-based search
function useApiSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get search query from URL params
  const searchQuery = searchParams.get("q") || "";

  // Debounce the search query to avoid making requests on every keystroke
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  const setSearchQuery = (query: string) => {
    if (query.trim()) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  // Search for all results (protocols and threads) using debounced query
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
  } = useGetSearch({
    params: {
      q: debouncedSearchQuery,
      perPage: 5,
    },
  });

  // Get search suggestions for default results
  // Only fetch when there's an actual search query
  const { data: suggestionsData, isLoading: isSuggestionsLoading } =
    useGetSearchSuggestions({
      params: {
        q: debouncedSearchQuery,
      },
    });

  const isLoading =
    (isSearchLoading || isSearchFetching) && debouncedSearchQuery.length > 0;

  // Transform API response to SearchResult format
  const results = useMemo(() => {
    if (!debouncedSearchQuery || debouncedSearchQuery.trim().length < 2) {
      return [];
    }

    if (!searchData?.data) {
      return [];
    }

    // searchData is Response<Search>, so we need to access .data
    const searchResponse = searchData.data;

    // protocols and threads are single ProtocolResult/ThreadResult objects, not arrays
    const protocolResultsData: Protocols[] =
      searchResponse?.protocols?.results || [];

    const protocolResults: SearchResult[] = protocolResultsData.map(
      (protocol) => ({
        id: `protocol-${protocol.id}`,
        title: protocol.title,
        content: protocol.content,
        author: protocol.author,
        tags: Array.isArray(protocol.tags)
          ? protocol.tags
              .map((tag: Tags) =>
                typeof tag === "string" ? tag : tag.tag || String(tag.id || "")
              )
              .join(", ")
          : "",
        type: "protocol" as const,
      })
    );

    // threads is a single ThreadResult object, not an array
    const threadResultsData: Threads[] = searchResponse?.threads?.results || [];

    const threadResults: SearchResult[] = threadResultsData.map((thread) => ({
      id: `thread-${thread.id}`,
      title: thread.title,
      content: thread.body,
      author: thread.author,
      type: "thread" as const,
      protocol_id: thread.protocol?.id || "",
    }));

    return [...protocolResults, ...threadResults];
  }, [searchData, debouncedSearchQuery]);

  // Default results from suggestions
  const defaultResults = useMemo(() => {
    if (debouncedSearchQuery) {
      return [];
    }

    // suggestionsData is Response<Search>, so we need to access .data
    const suggestionsSearchResponse = suggestionsData?.data;
    const suggestionsProtocolResults =
      suggestionsSearchResponse?.protocols?.results?.slice(0, 3) || [];

    const protocolResults: SearchResult[] = suggestionsProtocolResults.map(
      (protocol) => ({
        id: `protocol-${protocol.id}`,
        title: protocol.title,
        content: protocol.content,
        author: protocol.author,
        tags: Array.isArray(protocol.tags)
          ? protocol.tags
              .map((tag) => tag.tag || String(tag.id || ""))
              .join(", ")
          : "",
        type: "protocol" as const,
      })
    );

    const suggestionsThreadResults =
      suggestionsSearchResponse?.threads?.results?.slice(0, 3) || [];

    const threadResults: SearchResult[] = suggestionsThreadResults.map(
      (thread) => ({
        id: `thread-${thread.id}`,
        title: thread.title,
        content: thread.body,
        author: thread.author,
        type: "thread" as const,
        protocol_id: thread.protocol?.id || "",
      })
    );

    return [...protocolResults, ...threadResults];
  }, [suggestionsData, debouncedSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
    defaultResults,
    isDefaultLoading: isSuggestionsLoading && !searchQuery,
  };
}

function SearchShortcut({
  placeholder = "Search protocols and threads...",
}: SearchProps) {
  const { toggleOpen } = useSearchDialogStore();
  return (
    <section
      className="flex items-center gap-4 rounded-md border p-2 px-4 border-gray-200 bg-white w-full"
      onClick={() => toggleOpen()}
    >
      <SearchIcon className="size-4 text-muted-foreground" />
      <p className="text-muted-foreground text-xs md:text-sm flex items-center gap-2 justify-between w-full">
        {placeholder}
        <span className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
          <kbd className="text-xs bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            ctrl
          </kbd>
          <kbd className="text-xs bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            K
          </kbd>
        </span>
      </p>
    </section>
  );
}

function Search({
  placeholder = "Search protocols and threads...",
}: SearchProps) {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, toggleOpen } = useSearchDialogStore();
  const {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
    defaultResults,
    isDefaultLoading,
  } = useApiSearch();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleOpen]);

  // Group results by type
  const protocolResults = results.filter((r) => r.type === "protocol");
  const threadResults = results.filter((r) => r.type === "thread");
  const defaultProtocolResults = defaultResults.filter(
    (r) => r.type === "protocol"
  );
  const defaultThreadResults = defaultResults.filter(
    (r) => r.type === "thread"
  );

  const handleItemSelect = (result: SearchResult) => {
    setIsOpen(false);

    if (result.type === "protocol") {
      navigate(
        `${PathName.PROTOCOLS}/${result.id.replace("protocol-", "")}/${slugify(
          result.title
        )}`
      );
    } else {
      navigate(
        `${PathName.THREADS}/${result.id.replace("thread-", "")}/${slugify(
          result.title
        )}`
      );
    }
  };

  return (
    <main className="w-full">
      <SearchShortcut placeholder={placeholder} />
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search protocols and threads..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {(isLoading || isDefaultLoading) && (
            <div className="flex items-center justify-center py-6">
              <div className="text-sm text-muted-foreground">Searching...</div>
            </div>
          )}

          {!isLoading &&
            !isDefaultLoading &&
            searchQuery &&
            results.length === 0 && (
              <CommandEmpty>
                <p className="text-xs md:text-sm text-muted-foreground">
                  No results found.
                </p>
              </CommandEmpty>
            )}

          {/* Show search results when there's a query */}
          {searchQuery && protocolResults.length > 0 && (
            <CommandGroup heading="Protocols" forceMount className="p-4">
              {protocolResults.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.author} ${result.tags}`}
                  onSelect={() => handleItemSelect(result)}
                  forceMount
                >
                  <section className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {result.highlightedTitle ? (
                          <HighlightedText text={result.highlightedTitle} />
                        ) : (
                          result.title
                        )}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded-md">
                        Protocol
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      By{" "}
                      {result.highlightedAuthor ? (
                        <HighlightedText text={result.highlightedAuthor} />
                      ) : (
                        result.author
                      )}
                    </span>
                    {result.tags && (
                      <span className="text-xs text-blue-500 rounded-md mt-1">
                        Tags: {result.tags}
                      </span>
                    )}
                    {result.content && (
                      <span className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {result.highlightedContent ? (
                          <HighlightedText
                            text={
                              result.highlightedContent.substring(0, 100) +
                              "..."
                            }
                          />
                        ) : (
                          result.content.substring(0, 100) + "..."
                        )}
                      </span>
                    )}
                  </section>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchQuery && threadResults.length > 0 && (
            <CommandGroup heading="Threads" forceMount className="p-4">
              {threadResults.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.author}`}
                  onSelect={() => handleItemSelect(result)}
                  forceMount
                >
                  <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {result.highlightedTitle ? (
                          <HighlightedText text={result.highlightedTitle} />
                        ) : (
                          result.title
                        )}
                      </span>
                      <span className="text-xs bg-green-100 text-green-500 rounded-md px-2 py-1 ">
                        Thread
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      By{" "}
                      {result.highlightedAuthor ? (
                        <HighlightedText text={result.highlightedAuthor} />
                      ) : (
                        result.author
                      )}
                    </span>
                    {result.content && (
                      <span className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {result.highlightedContent ? (
                          <HighlightedText
                            text={
                              result.highlightedContent.substring(0, 100) +
                              "..."
                            }
                          />
                        ) : (
                          result.content.substring(0, 100) + "..."
                        )}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Show default results when no search query */}
          {!searchQuery && !isDefaultLoading && (
            <>
              {defaultProtocolResults.length > 0 && (
                <CommandGroup
                  heading="Recent Protocols"
                  forceMount
                  className="p-4"
                >
                  {defaultProtocolResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.author} ${result.tags}`}
                      onSelect={() => handleItemSelect(result)}
                      forceMount
                    >
                      <section className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.title}</span>
                          <span className="text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded-md">
                            Protocol
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          By {result.author}
                        </span>
                        {result.tags && (
                          <span className="text-xs text-blue-500 mt-1">
                            Tags: {result.tags}
                          </span>
                        )}
                        {result.content && (
                          <span className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {result.content.substring(0, 100)}...
                          </span>
                        )}
                      </section>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {defaultThreadResults.length > 0 && (
                <CommandGroup
                  heading="Recent Threads"
                  forceMount
                  className="p-4"
                >
                  {defaultThreadResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.author}`}
                      onSelect={() => handleItemSelect(result)}
                      forceMount
                    >
                      <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.title}</span>
                          <span className="text-xs bg-green-100 text-green-500 px-2 py-1 rounded-md">
                            Thread
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          By {result.author}
                        </span>
                        {result.content && (
                          <span className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {result.content.substring(0, 100)}...
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </main>
  );
}

export { Search };
