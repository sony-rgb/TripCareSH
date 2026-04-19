import { StyleSheet } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 46,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BaseColor.grayColor,
  },
  errorText: {
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'left',
  },
  tripInfo: (colors: any) => ({
    backgroundColor: colors.card,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  }),
  tripWarning: (colors: any) => ({
    backgroundColor: colors.accent + '20',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  }),
});

