import { SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Typesense from 'typesense';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  TYPESENSE_API_KEY,
  TYPESENSE_HOST,
  TYPESENSE_PORT,
  TYPESENSE_PROTOCOL,
} from '@/lib/constants';
import { PathName } from '@/models/path-enums';
import { useSearchDialogStore } from '@/store/search-dialog-store';

/**
 * Search Component
 * @description Provides a search dialog for protocols and threads. Uses Typesense for multi-index search.
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
 * @param {string} className - Additional class names for styling.
 * @param {boolean} isOpen - Whether the search dialog is open.
 * @param {function} setIsOpen - Function to set the open state of the dialog.
 * @param {string} searchQuery - The current search query.
 * @param {function} setSearchQuery - Function to update the search query.
 * @param {Array<SearchResult>} results - The search results to display.
 * @param {boolean} isLoading - Whether the search is currently loading.
 * @param {Array<SearchResult>} defaultResults - Default results to show when no search query is present.
 * @param {function} fetchDefaultResults - Function to fetch default results.
 * @param {function} handleItemSelect - Function to handle selection of a search result.
 * @param {function} toggleOpen - Function to toggle the open state of the search dialog.
 *
 * @returns {JSX.Element} The Search component.
 * @example
 * <Search placeholder="Search protocols and threads..." />
 */

// Helper function to render highlighted text
function HighlightedText({ text }: { text: string }) {
  // Typesense uses <mark> tags by default for highlighting
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

// Initialize Typesense client for multi-index search
const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: TYPESENSE_PORT,
      protocol: TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2,
});

// Interface for search results
interface SearchResult {
  id: string;
  title: string;
  content?: string;
  author: string;
  tags?: string;
  type: 'protocol' | 'thread';
  protocol_id?: number;
  // Highlighted versions for search results
  highlightedTitle?: string;
  highlightedContent?: string;
  highlightedAuthor?: string;
}

interface ProtocolHit {
  document: {
    id: string;
    title: string;
    content?: string;
    author: string;
    tags?: string | string[];
  };
  highlight?: {
    title?: { snippet: string };
    content?: { snippet: string };
    author?: { snippet: string };
  };
}

type ThreadHit = {
  document: {
    id: string;
    title: string;
    body?: string;
    author: string;
    protocol_id?: string;
  };
  highlight?: {
    title?: { snippet: string };
    body?: { snippet: string };
    author?: { snippet: string };
  };
};

// Hook for multi-index search
function useMultiIndexSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultResults, setDefaultResults] = useState<SearchResult[]>([]);

  // Get search query from URL params
  const searchQuery = searchParams.get('q') || '';

  const setSearchQuery = (query: string) => {
    if (query.trim()) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  // Function to fetch default results - memoized with useCallback
  const fetchDefaultResults = useCallback(async () => {
    setIsLoading(true);
    try {
      // Multi-search request to get default results from both collections
      const searchResults = await typesenseClient.multiSearch.perform({
        searches: [
          {
            collection: 'protocols_index',
            q: '*',
            query_by: 'title,content,author,tags',
            per_page: 3,
            sort_by: 'created_at:desc',
            highlight_fields: 'title,content,author',
          },
          {
            collection: 'threads_index',
            q: '*',
            query_by: 'title,body,author',
            per_page: 3,
            sort_by: 'created_at:desc',
            highlight_fields: 'title,body,author',
          },
        ],
      });

      const protocolHits =
        (searchResults.results[0] as { hits?: ProtocolHit[] })?.hits || [];

      const protocolResults: SearchResult[] =
        protocolHits.map((hit) => ({
          id: `protocol-${hit.document.id}`,
          title: hit.document.title,
          content: hit.document.content,
          author: hit.document.author,
          tags: Array.isArray(hit.document.tags)
            ? hit.document.tags.join(', ')
            : hit.document.tags,
          type: 'protocol' as const,
        })) || [];

      const threadHits =
        (searchResults.results[1] as { hits?: ThreadHit[] })?.hits || [];

      const threadResults: SearchResult[] =
        threadHits.map((hit) => ({
          id: `thread-${hit.document.id}`,
          title: hit.document.title,
          content: hit.document.body,
          author: hit.document.author,
          type: 'thread' as const,
          protocol_id: hit.document.protocol_id
            ? parseInt(hit.document.protocol_id)
            : undefined,
        })) || [];

      setDefaultResults([...protocolResults, ...threadResults]);
    } catch (error) {
      console.error('Default results error:', error);
      setDefaultResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const performSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Multi-search request to search both collections
      const searchResults = await typesenseClient.multiSearch.perform({
        searches: [
          {
            collection: 'protocols_index',
            q: query,
            query_by: 'title,content,author,tags',
            per_page: 5,
            sort_by: '_text_match:desc',
            highlight_fields: 'title,content,author',
            highlight_start_tag: '<mark>',
            highlight_end_tag: '</mark>',
          },
          {
            collection: 'threads_index',
            q: query,
            query_by: 'title,body,author',
            per_page: 5,
            sort_by: '_text_match:desc',
            highlight_fields: 'title,body,author',
            highlight_start_tag: '<mark>',
            highlight_end_tag: '</mark>',
          },
        ],
      });

      const protocolHits =
        (searchResults.results[0] as { hits?: ProtocolHit[] })?.hits || [];

      const protocolResults: SearchResult[] =
        protocolHits.map((hit) => ({
          id: `protocol-${hit.document.id}`,
          title: hit.document.title,
          content: hit.document.content,
          author: hit.document.author,
          tags: Array.isArray(hit.document.tags)
            ? hit.document.tags.join(', ')
            : hit.document.tags,
          type: 'protocol' as const,
          // Add highlighted versions if available
          highlightedTitle: hit.highlight?.title?.snippet || hit.document.title,
          highlightedContent:
            hit.highlight?.content?.snippet || hit.document.content,
          highlightedAuthor:
            hit.highlight?.author?.snippet || hit.document.author,
        })) || [];

      const threadHits =
        (searchResults.results[1] as { hits?: ThreadHit[] })?.hits || [];

      const threadResults: SearchResult[] =
        threadHits.map((hit) => ({
          id: `thread-${hit.document.id}`,
          title: hit.document.title,
          content: hit.document.body,
          author: hit.document.author,
          type: 'thread' as const,
          protocol_id: hit.document.protocol_id
            ? parseInt(hit.document.protocol_id)
            : undefined,
          // Add highlighted versions if available
          highlightedTitle: hit.highlight?.title?.snippet || hit.document.title,
          highlightedContent: hit.highlight?.body?.snippet || hit.document.body,
          highlightedAuthor:
            hit.highlight?.author?.snippet || hit.document.author,
        })) || [];

      // Combine and sort by relevance
      const combinedResults = [...protocolResults, ...threadResults].sort(
        (a, b) => a.title.localeCompare(b.title)
      );

      setResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => performSearch(searchQuery), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
    defaultResults,
    fetchDefaultResults,
  };
}

function SearchShortcut({
  placeholder = 'Search protocols and threads...',
}: SearchProps) {
  const { toggleOpen } = useSearchDialogStore();
  return (
    <section
      className='flex items-center gap-4 rounded-md border p-2 px-4 border-gray-200 bg-white w-full'
      onClick={() => toggleOpen()}
    >
      <SearchIcon className='size-4 text-muted-foreground' />
      <p className='text-muted-foreground text-xs md:text-sm flex items-center gap-2 justify-between w-full'>
        {placeholder}
        <span className='flex items-center gap-1 text-xs md:text-sm text-muted-foreground'>
          <kbd className='text-xs bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
            ctrl
          </kbd>
          <kbd className='text-xs bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none'>
            K
          </kbd>
        </span>
      </p>
    </section>
  );
}

function Search({
  placeholder = 'Search protocols and threads...',
}: SearchProps) {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, toggleOpen } = useSearchDialogStore();
  const {
    searchQuery,
    setSearchQuery,
    results,
    isLoading,
    defaultResults,
    fetchDefaultResults,
  } = useMultiIndexSearch();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggleOpen]);

  // Fetch default results when dialog opens - now with proper dependency
  useEffect(() => {
    if (isOpen && !searchQuery) {
      fetchDefaultResults();
    }
  }, [isOpen, searchQuery, fetchDefaultResults]);

  // Group results by type
  const protocolResults = results.filter((r) => r.type === 'protocol');
  const threadResults = results.filter((r) => r.type === 'thread');
  const defaultProtocolResults = defaultResults.filter(
    (r) => r.type === 'protocol'
  );
  const defaultThreadResults = defaultResults.filter(
    (r) => r.type === 'thread'
  );

  const handleItemSelect = (result: SearchResult) => {
    setIsOpen(false);

    if (result.type === 'protocol') {
      navigate(`${PathName.PROTOCOLS}/${result.id.replace('protocol-', '')}`);
    } else {
      navigate(`${PathName.THREADS}/${result.id.replace('thread-', '')}`);
    }
  };

  return (
    <main className='w-full'>
      <SearchShortcut placeholder={placeholder} />
      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <CommandInput
          placeholder='Search protocols and threads...'
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {isLoading && (
            <div className='flex items-center justify-center py-6'>
              <div className='text-sm text-muted-foreground'>Searching...</div>
            </div>
          )}

          {!isLoading && searchQuery && results.length === 0 && (
            <CommandEmpty>
              <p className='text-xs md:text-sm text-muted-foreground'>
                No results found.
              </p>
            </CommandEmpty>
          )}

          {/* Show search results when there's a query */}
          {searchQuery && protocolResults.length > 0 && (
            <CommandGroup
              heading='Protocols'
              forceMount
              className='p-4'
            >
              {protocolResults.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.author} ${result.tags}`}
                  onSelect={() => handleItemSelect(result)}
                  forceMount
                >
                  <section className='flex flex-col w-full'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>
                        {searchQuery ? (
                          <HighlightedText
                            text={result.highlightedTitle || result.title}
                          />
                        ) : (
                          result.title
                        )}
                      </span>
                      <span className='text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded-md'>
                        Protocol
                      </span>
                    </div>
                    <span className='text-xs text-muted-foreground mt-1'>
                      By{' '}
                      {searchQuery && result.highlightedAuthor ? (
                        <HighlightedText text={result.highlightedAuthor} />
                      ) : (
                        result.author
                      )}
                    </span>
                    {result.tags && (
                      <span className='text-xs text-blue-500 rounded-md mt-1'>
                        Tags: {result.tags}
                      </span>
                    )}
                    {result.content && (
                      <span className='text-xs text-gray-600 mt-1 line-clamp-2'>
                        {searchQuery && result.highlightedContent ? (
                          <HighlightedText
                            text={
                              result.highlightedContent.substring(0, 100) +
                              '...'
                            }
                          />
                        ) : (
                          result.content.substring(0, 100) + '...'
                        )}
                      </span>
                    )}
                  </section>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchQuery && threadResults.length > 0 && (
            <CommandGroup
              heading='Threads'
              forceMount
              className='p-4'
            >
              {threadResults.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.author}`}
                  onSelect={() => handleItemSelect(result)}
                  forceMount
                >
                  <div className='flex flex-col w-full'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>
                        {searchQuery ? (
                          <HighlightedText
                            text={result.highlightedTitle || result.title}
                          />
                        ) : (
                          result.title
                        )}
                      </span>
                      <span className='text-xs bg-green-100 text-green-500 rounded-md px-2 py-1 '>
                        Thread
                      </span>
                    </div>
                    <span className='text-xs text-muted-foreground mt-1'>
                      By{' '}
                      {searchQuery && result.highlightedAuthor ? (
                        <HighlightedText text={result.highlightedAuthor} />
                      ) : (
                        result.author
                      )}
                    </span>
                    {result.content && (
                      <span className='text-xs text-gray-600 mt-1 line-clamp-2'>
                        {searchQuery && result.highlightedContent ? (
                          <HighlightedText
                            text={
                              result.highlightedContent.substring(0, 100) +
                              '...'
                            }
                          />
                        ) : (
                          result.content.substring(0, 100) + '...'
                        )}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Show default results when no search query */}
          {!searchQuery && !isLoading && (
            <>
              {defaultProtocolResults.length > 0 && (
                <CommandGroup
                  heading='Recent Protocols'
                  forceMount
                  className='p-4'
                >
                  {defaultProtocolResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.author} ${result.tags}`}
                      onSelect={() => handleItemSelect(result)}
                      forceMount
                    >
                      <section className='flex flex-col w-full'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium'>{result.title}</span>
                          <span className='text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded-md'>
                            Protocol
                          </span>
                        </div>
                        <span className='text-xs text-muted-foreground mt-1'>
                          By {result.author}
                        </span>
                        {result.tags && (
                          <span className='text-xs text-blue-500 mt-1'>
                            Tags: {result.tags}
                          </span>
                        )}
                        {result.content && (
                          <span className='text-xs text-gray-600 mt-1 line-clamp-2'>
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
                  heading='Recent Threads'
                  forceMount
                  className='p-4'
                >
                  {defaultThreadResults.map((result) => (
                    <CommandItem
                      key={result.id}
                      value={`${result.title} ${result.author}`}
                      onSelect={() => handleItemSelect(result)}
                      forceMount
                    >
                      <div className='flex flex-col w-full'>
                        <div className='flex items-center justify-between'>
                          <span className='font-medium'>{result.title}</span>
                          <span className='text-xs bg-green-100 text-green-500 px-2 py-1 rounded-md'>
                            Thread
                          </span>
                        </div>
                        <span className='text-xs text-muted-foreground mt-1'>
                          By {result.author}
                        </span>
                        {result.content && (
                          <span className='text-xs text-gray-600 mt-1 line-clamp-2'>
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
