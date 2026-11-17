import { StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "./theme";

export const adminStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSize.lg, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted },
  logout: { color: colors.error, fontSize: fontSize.sm, fontWeight: "700" },
  message: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.md },
  emptyText: { textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  client: { fontSize: fontSize.base, fontWeight: "700", color: colors.text },
  detail: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs },
  amount: { fontSize: fontSize.lg, fontWeight: "800", color: colors.primary, marginTop: spacing.sm },
  rulesOk: { color: colors.secondary, fontSize: fontSize.sm, fontWeight: "700", marginTop: spacing.sm },
  rulesFail: { color: colors.error, fontSize: fontSize.sm, marginTop: spacing.xs },
  actions: { flexDirection: "row", marginTop: spacing.md },
  approve: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: spacing.sm,
  },
  reject: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabled: { opacity: 0.4 },
  approveText: { color: colors.surface, fontWeight: "700" },
  rejectText: { color: colors.error, fontWeight: "700" },
});