import { StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "./theme";

export const historyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  amount: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.primary,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.surface,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  detail: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  payRow: {
    flexDirection: "row",
    marginTop: spacing.md,
  },
  payInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: fontSize.base,
    color: colors.text,
    marginRight: spacing.sm,
  },
  payButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  payButtonText: {
    color: colors.surface,
    fontWeight: "700",
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  moraLink: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.sm,
    textAlign: "right",
  },
});