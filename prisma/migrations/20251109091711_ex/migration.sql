-- CreateTable
CREATE TABLE "User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" INTEGER,
    "email" TEXT,
    "introduction" TEXT,
    "job" TEXT
);

-- CreateTable
CREATE TABLE "License" (
    "licenseId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gotDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    CONSTRAINT "License_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Career" (
    "careerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    CONSTRAINT "Career_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stack" (
    "stackId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT,
    CONSTRAINT "Stack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "portfolioId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watched" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "isPublic" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioStack" (
    "stackId" INTEGER NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    PRIMARY KEY ("stackId", "portfolioId", "userId"),
    CONSTRAINT "PortfolioStack_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("portfolioId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("stackId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioCareer" (
    "careerId" INTEGER NOT NULL,
    "portfolioId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("careerId", "portfolioId", "userId"),
    CONSTRAINT "PortfolioCareer_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career" ("careerId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioCareer_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("portfolioId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PortfolioCareer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "projectId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "role" TEXT,
    "thumbnail" TEXT,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectTag" (
    "tagId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("projectId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectStack" (
    "stackId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stackName" TEXT NOT NULL,

    PRIMARY KEY ("stackId", "projectId", "userId"),
    CONSTRAINT "ProjectStack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("projectId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectStack_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("stackId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectContent" (
    "projectContentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "ProjectContent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("projectId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "imageURL" TEXT NOT NULL,

    PRIMARY KEY ("projectId", "userId"),
    CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("projectId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Link" (
    "linkId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "linkSite" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    CONSTRAINT "Link_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("projectId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PortfolioProjects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PortfolioProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Portfolio" ("portfolioId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PortfolioProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project" ("projectId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_PortfolioProjects_AB_unique" ON "_PortfolioProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_PortfolioProjects_B_index" ON "_PortfolioProjects"("B");
