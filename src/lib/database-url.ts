/**
 * Resolve Postgres URLs from env. Vercel Prisma Postgres may set
 * PRISMA_DATABASE_URL / POSTGRES_URL instead of DATABASE_URL.
 */
export function getDatabaseUrl(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.PRISMA_DATABASE_URL ??
    process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set (or PRISMA_DATABASE_URL / POSTGRES_URL from Vercel)",
    );
  }
  return url;
}

/** Direct connection for Prisma CLI (migrate, studio). */
export function getDirectDatabaseUrl(): string {
  return (
    process.env.DIRECT_URL ??
    process.env.POSTGRES_URL ??
    process.env.PRISMA_DATABASE_URL ??
    getDatabaseUrl()
  );
}
