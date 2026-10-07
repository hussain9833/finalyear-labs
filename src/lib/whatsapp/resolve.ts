import type { WhatsAppIntent, WhatsAppNumberType } from "./types";

export type ResolveInput = {
  intent: WhatsAppIntent;
  /** The routing key stored on the project's (or page's) category, e.g. "ai" | "web" | "ecommerce". */
  categoryRoute?: WhatsAppNumberType;
};

/**
 * Picks which WhatsApp number type handles a click. Pure — numbers are injected so it is unit-testable.
 * Order: intent-specific → category route → sales → default. Missing numbers fall through.
 */
export function resolveNumberType(
  { intent, categoryRoute }: ResolveInput,
  numbers: Record<WhatsAppNumberType, string | undefined>,
): { numberType: WhatsAppNumberType; number: string } | null {
  const chain: WhatsAppNumberType[] = [];
  switch (intent) {
    case "support":
      chain.push("support");
      break;
    case "custom":
      chain.push("custom", "sales");
      break;
    case "project":
    case "ai_project":
      if (categoryRoute) chain.push(categoryRoute);
      if (intent === "ai_project") chain.push("ai");
      chain.push("sales");
      break;
    case "general":
    case "pricing":
      if (categoryRoute) chain.push(categoryRoute);
      chain.push("sales");
      break;
  }
  chain.push("default");

  for (const type of chain) {
    const number = numbers[type];
    if (number) return { numberType: type, number };
  }
  return null;
}
