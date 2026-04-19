import { BaseColor } from '@config';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryContainer: {
    marginBottom: 30,
  },
  categoryTitle: {
    marginBottom: 15,
    color: BaseColor.textPrimaryColor,
  },
  pagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pageButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageIcon: {
    marginBottom: 8,
  },
  pageTitle: {
    textAlign: 'center',
    lineHeight: 16,
  },
}); 