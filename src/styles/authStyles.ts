import { StyleSheet } from "react-native";
import { colors, spacing, fontSize } from "../styles/theme";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    // sombra sutil, no la "soft grey shadow" genérica en todo
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  brand: {
    fontSize: fontSize.title,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
  },
  brandUnderline: {
    width: 40,
    height: 3,
    backgroundColor: colors.accent,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
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
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
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
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  linkText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  linkAction: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
});