"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { authApi } from "@/services/api/auth";
import { ApiError, getErrorMessage } from "@/lib/api/errors";
import {
  validateName,
  validateOptionalEmail,
  validatePhone,
  validateSmsCode,
} from "@/lib/forms/validate";

type SmsMode = "login" | "register" | "link";

export function SmsAuthPanel({ mode }: { mode: SmsMode }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [suggestRegister, setSuggestRegister] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const errors: Record<string, string> = {};
    if (mode === "register") {
      const fn = validateName(firstName, "prénom");
      const ln = validateName(lastName, "nom");
      const em = validateOptionalEmail(email);
      if (!fn.valid) errors.firstName = fn.message!;
      if (!ln.valid) errors.lastName = ln.message!;
      if (!em.valid) errors.email = em.message!;
    }
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) errors.phone = phoneCheck.message!;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    setInfo(null);
    setSuggestRegister(false);

    try {
      const data = await authApi.sendSmsCode(phone.trim());
      setStep("code");
      setInfo(
        data.message ??
          "Un code a été envoyé par SMS. En développement sans Twilio, utilisez 000000.",
      );
    } catch (err) {
      setFormError(getErrorMessage(err, "Envoi du code impossible."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const codeCheck = validateSmsCode(code);
    if (!codeCheck.valid) {
      setFieldErrors({ code: codeCheck.message! });
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    setSuggestRegister(false);

    try {
      if (mode === "link") {
        await authApi.linkPhone(phone, code);
      } else if (mode === "register") {
        await authApi.verifySms({
          phone,
          code,
          role: "client",
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          ...(email.trim() ? { email: email.trim() } : {}),
        });
      } else {
        await authApi.verifySms({ phone, code });
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.code === "USER_NOT_FOUND") {
        setSuggestRegister(true);
      }
      setFormError(getErrorMessage(err, "Vérification impossible."));
      setIsLoading(false);
    }
  };

  if (step === "phone") {
    return (
      <form onSubmit={handleSendCode} className="flex flex-col gap-5" noValidate>
        {formError && (
          <div className="form-banner-error" role="alert">
            {formError}
          </div>
        )}

        {mode === "register" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Prénom"
              htmlFor="sms-firstName"
              error={fieldErrors.firstName}
              required
            >
              <input
                id="sms-firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClassName(!!fieldErrors.firstName)}
                placeholder="Jean"
              />
            </FormField>
            <FormField
              label="Nom"
              htmlFor="sms-lastName"
              error={fieldErrors.lastName}
              required
            >
              <input
                id="sms-lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClassName(!!fieldErrors.lastName)}
                placeholder="Dupont"
              />
            </FormField>
          </div>
        )}

        {mode === "register" && (
          <FormField
            label="Email"
            htmlFor="sms-email"
            error={fieldErrors.email}
            hint="Facultatif — pour recevoir vos factures par email."
          >
            <input
              id="sms-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName(!!fieldErrors.email)}
              placeholder="jean.dupont@email.com"
            />
          </FormField>
        )}

        <FormField
          label="Téléphone mobile"
          htmlFor="sms-phone"
          error={fieldErrors.phone}
          hint="Format français : 06 12 34 56 78 ou +33 6 12 34 56 78"
          required
        >
          <input
            id="sms-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClassName(!!fieldErrors.phone)}
            placeholder="06 12 34 56 78"
          />
        </FormField>
        {mode === "link" && (
          <p className="text-xs text-text-muted -mt-2">
            Nous enverrons un code pour confirmer ce numéro sur votre compte.
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full justify-center py-4 text-lg disabled:opacity-50"
        >
          {isLoading ? "Envoi en cours…" : "Recevoir le code SMS"}
        </button>

        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-text-muted text-center">
            Dev sans Twilio : code fixe <strong>000000</strong>
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-5" noValidate>
      {formError && (
        <div className="form-banner-error" role="alert">
          {formError}
          {suggestRegister && (
            <p className="mt-2 font-normal">
              <Link href="/register" className="text-primary font-bold underline">
                Créer un compte par SMS →
              </Link>
            </p>
          )}
        </div>
      )}
      {info && !formError && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl font-medium">
          {info}
        </div>
      )}

      <FormField
        label="Code reçu par SMS"
        htmlFor="sms-code"
        error={fieldErrors.code}
        hint={`Code envoyé au ${phone}.`}
        required
      >
        <input
          id="sms-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className={`${inputClassName(!!fieldErrors.code)} text-center text-2xl tracking-[0.4em] font-mono`}
          placeholder="000000"
        />
      </FormField>
      <p className="text-xs text-text-muted -mt-3">
        <button
          type="button"
          className="text-primary font-semibold hover:underline"
          onClick={() => {
            setStep("phone");
            setCode("");
            setFormError(null);
            setFieldErrors({});
          }}
        >
          Modifier le numéro
        </button>
      </p>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full justify-center py-4 text-lg disabled:opacity-50"
      >
        {isLoading
          ? "Vérification…"
          : mode === "link"
            ? "Lier ce numéro"
            : mode === "register"
              ? "Créer mon compte"
              : "Se connecter"}
      </button>
    </form>
  );
}
