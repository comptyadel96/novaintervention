"use client";

import { useState } from "react";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { authApi } from "@/services/api/auth";
import { getErrorMessage } from "@/lib/api/errors";
import {
  validatePassword,
  validatePasswordConfirm,
  validateRequired,
} from "@/lib/forms/validate";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    const currentCheck = validateRequired(
      currentPassword,
      "Mot de passe actuel",
    );
    const newCheck = validatePassword(newPassword);
    const confirmCheck = validatePasswordConfirm(newPassword, confirmPassword);

    const errors: typeof fieldErrors = {};
    if (!currentCheck.valid) errors.current = currentCheck.message!;
    if (!newCheck.valid) errors.new = newCheck.message!;
    if (!confirmCheck.valid) errors.confirm = confirmCheck.message!;
    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.new =
        "Le nouveau mot de passe doit être différent de l'actuel.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const data = await authApi.updatePassword(currentPassword, newPassword);
      setSuccess(data.message ?? "Mot de passe mis à jour avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setFormError(getErrorMessage(err, "Mise à jour impossible."));
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <h3 className="text-lg font-bold text-primary-dk">Mot de passe</h3>
      {formError && (
        <div className="form-banner-error" role="alert">
          {formError}
        </div>
      )}
      {success && (
        <p className="text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          {success}
        </p>
      )}
      <FormField
        label="Mot de passe actuel"
        htmlFor="pwd-current"
        error={fieldErrors.current}
        required
      >
        <input
          id="pwd-current"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClassName(!!fieldErrors.current)}
        />
      </FormField>
      <FormField
        label="Nouveau mot de passe"
        htmlFor="pwd-new"
        error={fieldErrors.new}
        hint="Au moins 8 caractères."
        required
      >
        <input
          id="pwd-new"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClassName(!!fieldErrors.new)}
        />
      </FormField>
      <FormField
        label="Confirmer le nouveau mot de passe"
        htmlFor="pwd-confirm"
        error={fieldErrors.confirm}
        required
      >
        <input
          id="pwd-confirm"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClassName(!!fieldErrors.confirm)}
        />
      </FormField>
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? "Mise à jour…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}
