import type { WhatsAppIntent } from "./types";

export type MessageContext = {
  projectName?: string;
  categoryName?: string;
  degreeName?: string;
  requirements?: string;
};

const clean = (s: string | undefined, max = 200) =>
  s
    ?.replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max) || undefined;

/** Pre-filled WhatsApp messages. Pure and unit-tested. */
export function buildMessage(intent: WhatsAppIntent, raw: MessageContext = {}): string {
  const ctx = {
    projectName: clean(raw.projectName, 120),
    categoryName: clean(raw.categoryName, 80),
    degreeName: clean(raw.degreeName, 40),
    requirements: clean(raw.requirements, 600),
  };
  const degreeSentence = ctx.degreeName ? ` I am a ${ctx.degreeName} student.` : "";

  switch (intent) {
    case "project":
      if (!ctx.projectName) break;
      return `Hi, I am interested in the ${ctx.projectName} project.${degreeSentence} Please share the project details, pricing and customization options.`;
    case "ai_project":
      if (!ctx.projectName) break;
      return `Hi, I am interested in your AI-integrated project ${ctx.projectName}.${degreeSentence} Please share the details.`;
    case "custom": {
      const degree = ctx.degreeName ? ` My degree is ${ctx.degreeName}` : "";
      const reqs = ctx.requirements ? `${degree ? " and my" : " My"} requirements are: ${ctx.requirements}` : "";
      return `Hi, I want to discuss a custom final-year project.${degree}${reqs}${degree || reqs ? "." : ""}`.replace(/\.\.$/, ".");
    }
    case "pricing":
      if (ctx.categoryName)
        return `Hi, I want to know the pricing for your ${ctx.categoryName} projects.${degreeSentence}`;
      return `Hi, I want to know the pricing for your final-year projects.${degreeSentence}`;
    case "support":
      return "Hi, I need help with a project I purchased from you.";
    case "general":
      break;
  }
  if (ctx.categoryName)
    return `Hi, I want to know more about your ${ctx.categoryName} final-year projects.${degreeSentence}`;
  return `Hi, I want to know more about your final-year projects.${degreeSentence}`;
}

export function buildWaMeUrl(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
