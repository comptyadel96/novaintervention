"use client";

type AuthMethod = "email" | "sms";

export function AuthMethodTabs({
  value,
  onChange,
}: {
  value: AuthMethod;
  onChange: (method: AuthMethod) => void;
}) {
  return (
    <div className="flex gap-2 p-1 bg-bg-alt/50 rounded-xl mb-6">
      <button
        type="button"
        onClick={() => onChange("email")}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-colors ${
          value === "email"
            ? "bg-primary-dk text-white shadow-sm"
            : "bg-transparent text-text-muted hover:text-primary-dk"
        }`}
      >
        Email
      </button>
      <button
        type="button"
        onClick={() => onChange("sms")}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-colors ${
          value === "sms"
            ? "bg-primary-dk text-white shadow-sm"
            : "bg-transparent text-text-muted hover:text-primary-dk"
        }`}
      >
        SMS
      </button>
    </div>
  );
}
