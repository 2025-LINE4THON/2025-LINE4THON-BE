-- CreateTable: PortfolioCareer with snapshot data
CREATE TABLE "PortfolioCareer_new" (
    "portfolioCareerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "careerId" INTEGER,
    "portfolioId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    CONSTRAINT "PortfolioCareer_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career" ("careerId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PortfolioCareer_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("portfolioId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioCareer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Migrate existing data
INSERT INTO "PortfolioCareer_new" ("careerId", "portfolioId", "userId", "description", "content", "startDate", "endDate")
SELECT 
    pc."careerId",
    pc."portfolioId",
    pc."userId",
    pc."description",
    COALESCE(c."content", ''),
    COALESCE(c."startDate", CURRENT_TIMESTAMP),
    c."endDate"
FROM "PortfolioCareer" pc
LEFT JOIN "Career" c ON pc."careerId" = c."careerId";

DROP TABLE "PortfolioCareer";
ALTER TABLE "PortfolioCareer_new" RENAME TO "PortfolioCareer";

-- CreateTable: PortfolioStack with snapshot data
CREATE TABLE "PortfolioStack_new" (
    "portfolioStackId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stackId" INTEGER,
    "portfolioId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "stackName" TEXT NOT NULL DEFAULT '',
    "stackLevel" TEXT,
    CONSTRAINT "PortfolioStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("stackId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PortfolioStack_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("portfolioId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Migrate existing data
INSERT INTO "PortfolioStack_new" ("stackId", "portfolioId", "userId", "rank", "stackName", "stackLevel")
SELECT 
    ps."stackId",
    ps."portfolioId",
    ps."userId",
    ps."rank",
    COALESCE(s."name", ''),
    s."level"
FROM "PortfolioStack" ps
LEFT JOIN "Stack" s ON ps."stackId" = s."stackId";

DROP TABLE "PortfolioStack";
ALTER TABLE "PortfolioStack_new" RENAME TO "PortfolioStack";
