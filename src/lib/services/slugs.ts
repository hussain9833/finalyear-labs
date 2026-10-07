import "server-only";
import { trusted, type Types } from "mongoose";
import { RESERVED_SLUGS } from "@/lib/constants";
import { Category, Degree, Project } from "@/lib/db/models";

export class SlugConflictError extends Error {
  constructor(slug: string, owner: string) {
    super(`The URL slug “${slug}” is already used by a ${owner}. Slugs must be unique across degrees, categories and projects.`);
    this.name = "SlugConflictError";
  }
}

/**
 * Degrees, categories and projects share /projects/[slug], so a slug must be unique across all three
 * collections (and not reserved). `except` is the document being edited.
 */
export async function assertSlugAvailable(slug: string, except?: { kind: "degree" | "category" | "project"; id: string | Types.ObjectId }) {
  if (RESERVED_SLUGS.includes(slug)) throw new SlugConflictError(slug, "reserved system route");
  const notSelf = (kind: string) => (except && except.kind === kind ? { _id: trusted({ $ne: except.id }) } : {});
  const [d, c, p] = await Promise.all([
    Degree.exists({ slug, ...notSelf("degree") }),
    Category.exists({ slug, ...notSelf("category") }),
    Project.exists({ slug, ...notSelf("project") }),
  ]);
  if (d) throw new SlugConflictError(slug, "degree");
  if (c) throw new SlugConflictError(slug, "category");
  if (p) throw new SlugConflictError(slug, "project");
}
