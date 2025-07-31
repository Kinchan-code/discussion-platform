interface SuggestionsModel {
  id: number;
  title: string;
}

export interface Suggestions {
  protocols: SuggestionsModel[];
  threads: SuggestionsModel[];
}
