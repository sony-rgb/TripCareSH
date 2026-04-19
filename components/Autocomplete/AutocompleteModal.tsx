import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebouncedValue } from './useDebouncedValue';
import { AutocompleteOption, FetchOptionsFn } from './types';
import { BaseColor, useTheme } from '@config';
import { Icon } from '@components';

export interface AutocompleteModalProps {
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

export const AutocompleteModal: React.FC<AutocompleteModalProps> = ({
  visible,
  onClose,
  onSelect,
  title = '',
  placeholder = 'Enter code or name',
  initialQuery = '',
  fetchOptions,
  debounceMs = 250,
  minChars = 0,
  showClearButton = true,
  autoFocus = true,
  renderItem,
  emptyState,
  errorState,
  ListHeaderComponent,
  testID,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AutocompleteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [requestId, setRequestId] = useState(0);
  const searchInputRef = useRef<any>(null);
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (visible) {
      setQuery(initialQuery);
      setResults([]);
      setError(null);
      setRequestId(prev => prev + 1);
    }
  }, [visible, initialQuery]);

  // Handle search
  useEffect(() => {
    if (!visible) return;

    const currentRequestId = requestId;
    
    const performSearch = async () => {
      if (debouncedQuery.length < minChars) {
        setResults([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const options = await fetchOptions(debouncedQuery);
        
        // Only update if this is still the current request
        if (currentRequestId === requestId) {
          setResults(options);
          setLoading(false);
        }
      } catch (err) {
        if (currentRequestId === requestId) {
          setError(err);
          setLoading(false);
        }
      }
    };

    performSearch();
  }, [debouncedQuery, minChars, fetchOptions, visible, requestId]);

  // Auto focus search input
  useEffect(() => {
    if (visible && autoFocus) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visible, autoFocus]);

  const handleSelect = useCallback((option: AutocompleteOption) => {
    onSelect(option);
    onClose();
  }, [onSelect, onClose]);

  const handleClear = useCallback(() => {
    setQuery('');
    searchInputRef.current?.focus();
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setRequestId(prev => prev + 1);
  }, []);

  const defaultRenderItem = useCallback(({ item }: { item: AutocompleteOption }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemMain}>
          <Text style={styles.itemLabel}>{item.label}</Text>
          {item.meta && <Text style={styles.itemMeta}>{item.meta}</Text>}
        </View>
        {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
      </View>
    </TouchableOpacity>
  ), [handleSelect]);

  const defaultEmptyState = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No matches. Try a different search.</Text>
    </View>
  );

  const defaultErrorState = (err: unknown) => (
    <TouchableOpacity style={styles.errorContainer} onPress={handleRetry}>
      <Text style={styles.errorText}>Couldn't load results.</Text>
      <Text style={styles.retryText}>Tap to retry</Text>
    </TouchableOpacity>
  );

  const renderListItem = useCallback(({ item }: { item: AutocompleteOption }) => {
    if (renderItem) {
      return renderItem(item, { isSelected: false }) as React.ReactElement;
    }
    return defaultRenderItem({ item }) as React.ReactElement;
  }, [renderItem, defaultRenderItem]);

  const renderEmptyComponent = useCallback(() => {
    if (loading) return null;
    if (error) return (errorState || defaultErrorState)(error);
    if (results.length === 0 && debouncedQuery.length >= minChars) {
      return emptyState || defaultEmptyState;
    }
    return null;
  }, [loading, error, results.length, debouncedQuery.length, minChars, errorState, emptyState]);

  const renderListContent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      );
    }
    
    if (error) {
      return (errorState || defaultErrorState)(error);
    }
    
    if (results.length === 0 && debouncedQuery.length >= minChars) {
      return emptyState || defaultEmptyState;
    }
    
    return (
      <FlatList
        data={results}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent as any}
        contentContainerStyle={results.length === 0 ? styles.emptyListContainer : styles.resultsContainer}
      />
    );
  }, [loading, error, results, debouncedQuery.length, minChars, errorState, emptyState, renderListItem, ListHeaderComponent]);

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      propagateSwipe={true}
      useNativeDriverForBackdrop={true}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Icon name="times" size={20} color="#6A707C" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon
              name="search"
              size={18}
              color="#6A707C"
              style={styles.searchIcon}
            />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {showClearButton && query.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClear}
                hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
              >
                <Icon name="times" size={16} color="#6A707C" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Results List */}
        {renderListContent()}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 40,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E232C',
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1E232C',
    fontWeight: '400',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemContent: {
    flex: 1,
  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: 16,
    color: '#1E232C',
    fontWeight: '500',
    flex: 1,
  },
  itemMeta: {
    fontSize: 14,
    color: '#6A707C',
    fontWeight: '400',
    marginLeft: 12,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '400',
  },
  separator: {
    height: 0,
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#6A707C',
    textAlign: 'center',
    fontWeight: '400',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 15,
    color: '#6A707C',
    textAlign: 'center',
    fontWeight: '400',
  },
  retryText: {
    fontSize: 14,
    color: '#69b6e6',
    marginTop: 8,
    fontWeight: '600',
  },
  emptyListContainer: {
    flex: 1,
  },
  resultsContainer: {
    paddingVertical: 8,
  },
});

