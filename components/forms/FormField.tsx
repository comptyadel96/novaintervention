"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: Props) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor} className="form-label">
        {label}
        {required && (
          <span className="text-red-600 font-bold" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="form-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
}

export function inputClassName(hasError: boolean) {
  return `form-input w-full${hasError ? " form-input--error" : ""}`;
}
