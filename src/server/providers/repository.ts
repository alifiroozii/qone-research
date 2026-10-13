import { DemoRepository } from "@/server/repositories/demo-repository";

/**
 * Repository factory — the single seam between the UI and the data layer.
 *
 * Today it returns the browser-backed DemoRepository. When a real
 * PostgreSQL + Prisma backend is connected, swap the implementation
 * here (e.g. based on `process.env.DATABASE_URL`) and the rest of the
 * app keeps working unchanged.
 */
export function getRepository(): DemoRepository {
  return new DemoRepository();
}

export const repository = getRepository();
