import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text as RNText,
  Platform,
  InteractionManager,
} from 'react-native';
import Modal from 'react-native-modal';
import {Text, Icon, SafeAreaView} from '@components';
import {useTheme} from '@config';

interface LegalDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  title: string;
  content: string;
  acceptButtonText?: string;
  requireScrollToBottom?: boolean;
}

/**
 * LegalDocumentModal - A modal for displaying legal documents
 * 
 * Features:
 * - Full-screen modal with scrollable content
 * - Optional scroll-to-bottom requirement before accepting
 * - Visual indicator showing scroll progress
 * - Accept button only enabled after reading (if required)
 * - Industry-standard UX for legal document acceptance
 */
const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  visible,
  onClose,
  onAccept,
  title,
  content,
  acceptButtonText = 'I Accept',
  requireScrollToBottom = true,
}) => {
  const {colors} = useTheme();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [scrollViewKey, setScrollViewKey] = useState(0);
  const scrollViewRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Create a unique key based on title and content to ensure each modal instance is unique
  const modalInstanceKey = `${title}-${content.substring(0, 50)}`;

  /**
   * Cleanup function for timeouts
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  /**
   * Reset all state when modal becomes visible
   */
  useEffect(() => {
    if (visible) {
      // Clean up any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Reset all state immediately
      setHasScrolledToBottom(false);
      setScrollProgress(0);
      setContentHeight(0);
      setScrollViewHeight(0);
    } else {
      // Clean up when modal closes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Reset scroll position
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
    }
  }, [visible, title, content]);

  /**
   * Check if user has scrolled to (or near) the bottom
   */
  const handleScroll = useCallback((event: any) => {
    const {contentOffset, contentSize, layoutMeasurement} = event.nativeEvent;
    
    // Validate event data
    if (!contentOffset || !contentSize || !layoutMeasurement) {
      return;
    }
    
    const scrollPosition = contentOffset.y;
    const totalScrollableHeight = contentSize.height - layoutMeasurement.height;
    
    // Calculate scroll progress (0 to 1)
    const progress = totalScrollableHeight > 0 
      ? Math.min(Math.max(scrollPosition / totalScrollableHeight, 0), 1) 
      : 1;
    setScrollProgress(progress);
    
    // Consider "bottom" as within 50 pixels of the end
    const threshold = 50;
    const isAtBottom = totalScrollableHeight <= 0 || scrollPosition >= totalScrollableHeight - threshold;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  }, [hasScrolledToBottom]);

  /**
   * Handle content size change to determine if scrolling is needed
   */
  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
    // If content fits without scrolling, automatically enable accept
    if (height <= scrollViewHeight && scrollViewHeight > 0) {
      setHasScrolledToBottom(true);
    }
  };

  /**
   * Handle scroll view layout to get its height
   */
  const handleLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    setScrollViewHeight(height);
    // Check if content already fits
    if (contentHeight > 0 && contentHeight <= height) {
      setHasScrolledToBottom(true);
    }
  };

  /**
   * Reset state when modal closes
   */
  const handleClose = () => {
    setHasScrolledToBottom(false);
    setScrollProgress(0);
    onClose();
  };

  /**
   * Handle accept button press
   */
  const handleAccept = () => {
    onAccept();
    handleClose();
  };

  const canAccept = !requireScrollToBottom || hasScrolledToBottom;

  return (
    <Modal
      key={modalInstanceKey}
      isVisible={visible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onModalShow={() => {
        // Additional initialization when modal is fully shown
        // Force remount ScrollView to ensure it's fresh
        setScrollViewKey(prev => prev + 1);
        // Clean up any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: false });
          }
        }, 100);
      }}
      onModalHide={() => {
        // Cleanup when modal is hidden
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
      }}
      style={modalStyles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      propagateSwipe={true}
      avoidKeyboard={Platform.OS === 'ios'}
      swipeDirection={undefined}
      useNativeDriverForBackdrop={true}
    >
      <SafeAreaView style={modalStyles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={modalStyles.header}>
          <TouchableOpacity 
            onPress={handleClose} 
            style={modalStyles.closeButton}
          >
            <Icon name="times" size={20} color="#6A707C" />
          </TouchableOpacity>
          <Text style={modalStyles.title}>{title}</Text>
          <View style={modalStyles.closeButton} /> 
        </View>

        {/* Progress indicator */}
        {requireScrollToBottom && !hasScrolledToBottom && (
          <View style={modalStyles.progressContainer}>
            <View style={modalStyles.progressBar}>
              <View 
                style={[
                  modalStyles.progressFill, 
                  {width: `${scrollProgress * 100}%`, backgroundColor: colors.primary}
                ]} 
              />
            </View>
            <Text style={modalStyles.progressText}>
              {scrollProgress < 1 
                ? 'Scroll to read the entire document' 
                : 'Almost there...'}
            </Text>
          </View>
        )}

        {/* Scrollable content */}
        <View 
          style={modalStyles.scrollViewContainer} 
          onLayout={(event) => {
            handleLayout(event);
            // Ensure scroll is enabled when layout is ready
            setTimeout(() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: false });
              }
            }, 50);
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            key={`${modalInstanceKey}-scroll-${scrollViewKey}`}
            style={modalStyles.scrollView}
            contentContainerStyle={modalStyles.scrollContent}
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            {...(Platform.OS === 'ios' && { bounces: false })}
          >
            <RNText style={modalStyles.contentText}>{content}</RNText>
          </ScrollView>
        </View>

        {/* Scroll hint when not at bottom */}
        {requireScrollToBottom && !hasScrolledToBottom && (
          <View style={modalStyles.scrollHint}>
            <Icon name="chevron-down" size={16} color={colors.primary} />
            <Text style={[modalStyles.scrollHintText, {color: colors.primary}]}>
              Scroll down to continue
            </Text>
            <Icon name="chevron-down" size={16} color={colors.primary} />
          </View>
        )}

        {/* Footer with accept button */}
        <View style={modalStyles.footer}>
          <TouchableOpacity
            style={[
              modalStyles.acceptButton,
              {
                backgroundColor: canAccept ? colors.primary : '#D1D5DB',
              }
            ]}
            onPress={canAccept ? handleAccept : undefined}
            activeOpacity={canAccept ? 0.8 : 1}
          >
            <Text style={[
              modalStyles.acceptButtonText,
              {color: canAccept ? '#FFFFFF' : '#9CA3AF'}
            ]}>
              {canAccept ? acceptButtonText : 'Please read to the end'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
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
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E232C',
    flex: 1,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollViewContainer: {
    flex: 1,
    minHeight: 200,
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'android' && {
      flexGrow: 1,
    }),
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#374151',
    letterSpacing: 0.2,
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F0F9FF',
    gap: 8,
  },
  scrollHintText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  acceptButton: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LegalDocumentModal;

