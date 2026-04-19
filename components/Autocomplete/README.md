# Autocomplete Component

A reusable, data-source-agnostic autocomplete component that provides a full-screen modal search experience for React Native applications.

## Features

- **Full-screen modal** with search input and results list
- **Debounced search** to prevent excessive API calls
- **Loading, empty, and error states** with proper UX handling
- **Accessibility support** with proper ARIA labels and hints
- **Customizable rendering** with optional custom item renderers
- **Generic API** that works with any data source
- **Safe area aware** for proper display on all devices

## Components

### AutocompleteModal

The main component that provides the full-screen search experience.

```tsx
import { AutocompleteModal, AutocompleteOption, FetchOptionsFn } from '@/components/autocomplete';

interface AutocompleteModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: AutocompleteOption) => void;
  title?: string;
  placeholder?: string;
  initialQuery?: string;
  fetchOptions: FetchOptionsFn;
  debounceMs?: number;
  minChars?: number;
  showClearButton?: boolean;
  autoFocus?: boolean;
  renderItem?: (option: AutocompleteOption, state: { isSelected: boolean }) => React.ReactNode;
  emptyState?: React.ReactNode;
  errorState?: (error: unknown) => React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  testID?: string;
}
```

### AutocompleteTrigger (Optional)

A convenience wrapper that provides a pressable field to trigger the modal.

```tsx
import { AutocompleteTrigger } from '@/components/autocomplete';

interface AutocompleteTriggerProps {
  value?: string;
  onOpen: () => void;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  placeholderTextColor?: string;
  testID?: string;
}
```

## Types

### AutocompleteOption

```tsx
export type AutocompleteOption = {
  id: string;          // stable unique key
  label: string;       // primary display text (e.g., "KLM")
  meta?: string;       // trailing/secondary text (e.g., "(KL)")
  subtitle?: string;   // optional second line (e.g., "KLM Cityhopper")
  value?: string;      // value to return if different from label
  [k: string]: any;    // allow arbitrary extra fields
};
```

### FetchOptionsFn

```tsx
export type FetchOptionsFn = (q: string) =>
  Promise<AutocompleteOption[]> | AutocompleteOption[];
```

## Usage Examples

### Basic Usage

```tsx
import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { AutocompleteModal, AutocompleteOption } from '@/components/autocomplete';

const searchData = async (query: string): Promise<AutocompleteOption[]> => {
  // Your API call here
  const response = await fetch(`/api/search?q=${query}`);
  const data = await response.json();
  return data.map((item: any) => ({
    id: item.id,
    label: item.name,
    meta: item.code ? `(${item.code})` : undefined,
    subtitle: item.description,
    value: item.id,
  }));
};

export default function DataField() {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutocompleteOption | null>(null);

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        <TextInput
          pointerEvents="none"
          editable={false}
          placeholder="Select item"
          value={selectedItem ? `${selectedItem.label} ${selectedItem.meta ?? ""}`.trim() : ""}
        />
      </Pressable>

      <AutocompleteModal
        visible={visible}
        onClose={() => setVisible(false)}
        title=""
        placeholder="Enter search term"
        fetchOptions={searchData}
        onSelect={(opt) => { setSelectedItem(opt); setVisible(false); }}
        debounceMs={250}
        minChars={0}
      />
    </View>
  );
}
```

### Using AutocompleteTrigger

```tsx
import React, { useState } from 'react';
import { AutocompleteModal, AutocompleteTrigger, AutocompleteOption } from '@/components/autocomplete';

export default function DataFieldWithTrigger() {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutocompleteOption | null>(null);

  const displayValue = selectedItem ? `${selectedItem.label} ${selectedItem.meta ?? ""}`.trim() : "";

  return (
    <View>
      <AutocompleteTrigger
        value={displayValue}
        onOpen={() => setVisible(true)}
        placeholder="Select item"
        editable={true}
      />

      <AutocompleteModal
        visible={visible}
        onClose={() => setVisible(false)}
        title="Select Item"
        placeholder="Enter search term"
        fetchOptions={searchData}
        onSelect={(opt) => { setSelectedItem(opt); setVisible(false); }}
        debounceMs={250}
        minChars={0}
      />
    </View>
  );
}
```

### Custom Item Rendering

```tsx
const CustomRenderItem = ({ item }: { item: AutocompleteOption }) => (
  <View style={{ padding: 16, backgroundColor: '#f0f0f0' }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.label}</Text>
    {item.meta && <Text style={{ color: '#666' }}>{item.meta}</Text>}
  </View>
);

<AutocompleteModal
  // ... other props
  renderItem={CustomRenderItem}
/>
```

### Custom Empty and Error States

```tsx
const CustomEmptyState = () => (
  <View style={{ padding: 32, alignItems: 'center' }}>
    <Text style={{ fontSize: 16, color: '#999' }}>
      No items found matching your search
    </Text>
  </View>
);

const CustomErrorState = (error: unknown) => (
  <View style={{ padding: 32, alignItems: 'center' }}>
    <Text style={{ fontSize: 16, color: '#ff0000' }}>
      Error loading results: {error instanceof Error ? error.message : 'Unknown error'}
    </Text>
  </View>
);

<AutocompleteModal
  // ... other props
  emptyState={<CustomEmptyState />}
  errorState={CustomErrorState}
/>
```

## Styling

The component uses a neutral, system-like design that matches iOS/Android native components:

- **Background**: White (#fff)
- **Search field**: Light gray background (#F2F2F7) with rounded corners
- **Text colors**: Primary text (#000), secondary text (#8E8E93)
- **Accent color**: iOS blue (#007AFF) for interactive elements
- **Separators**: Hairline width (#E5E5E7)

## Accessibility

The component includes proper accessibility support:

- `accessibilityRole="button"` for interactive elements
- `accessibilityLabel` and `accessibilityHint` for screen readers
- Proper focus management
- Keyboard navigation support

## Performance Considerations

- **Debouncing**: Prevents excessive API calls while typing
- **Request cancellation**: Ignores stale responses from previous searches
- **FlatList optimization**: Uses `keyboardShouldPersistTaps="handled"`
- **Memory management**: Proper cleanup of timeouts and effects



## File Structure

```
src/app/components/autocomplete/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript type definitions
├── AutocompleteModal.tsx       # Main modal component
├── AutocompleteTrigger.tsx     # Optional trigger wrapper
├── useDebouncedValue.ts        # Debounce hook
└── README.md                   # This documentation
```
