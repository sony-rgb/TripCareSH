export type AutocompleteOption = {
  id: string;          // stable unique key
  label: string;       // primary display text (e.g., "KLM")
  meta?: string;       // trailing/secondary text (e.g., "(KL)")
  subtitle?: string;   // optional second line (e.g., "KLM Cityhopper")
  value?: string;      // value to return if different from label
  // Allow arbitrary extra fields
  [k: string]: any;
};

export type FetchOptionsFn = (q: string) =>
  Promise<AutocompleteOption[]> | AutocompleteOption[];
