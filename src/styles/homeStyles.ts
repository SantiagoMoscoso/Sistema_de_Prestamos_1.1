import { StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "./theme";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  userName: {
    fontSize: fontSize.title,
    fontWeight: "800",
    color: colors.primary,
    marginTop: spacing.xs,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  actionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
  },
  actionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  logoutButton: {
    marginTop: spacing.xl,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  logoutText: {
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
});