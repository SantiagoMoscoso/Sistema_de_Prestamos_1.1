import { StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "./theme";

export const loanStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: fontSize.base,
    color: colors.text,
    backgroundColor: colors.background,
  },
  previewBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  previewValue: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.secondary,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  successText: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonText: {
    color: colors.surface,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
});