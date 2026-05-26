import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/** Model delegates that must exist on the cached client (schema changes in dev). */
const MODEL_DELEGATES = ["application", "stageEvent", "resumeProfile"] as const;

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

function hasModelDelegates(client: PrismaClient): boolean {
  return MODEL_DELEGATES.every(
    (name) =>
      typeof (client as unknown as Record<string, unknown>)[name] === "object",
  );
}

function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (cached && hasModelDelegates(cached)) {
    return cached;
  }

  if (cached) {
    void cached.$disconnect();
  }

  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

function createPrismaExport(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    const client = globalForPrisma.prisma ?? createPrismaClient();
    globalForPrisma.prisma = client;
    return client;
  }

  return new Proxy({} as PrismaClient, {
    get(_target, prop, receiver) {
      const client = getPrismaClient();
      const value = Reflect.get(client, prop, receiver);
      return typeof value === "function"
        ? (value as (...args: unknown[]) => unknown).bind(client)
        : value;
    },
  });
}

export const prisma = createPrismaExport();
