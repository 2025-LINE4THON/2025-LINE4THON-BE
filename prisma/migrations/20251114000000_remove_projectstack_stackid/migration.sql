-- CreateTable for new ProjectStack structure
CREATE TABLE "ProjectStack_new" (
    "projectStackId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "stackName" TEXT NOT NULL,
    CONSTRAINT "ProjectStack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("projectId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectStack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data from old table (only stackName, projectId, userId)
INSERT INTO "ProjectStack_new" ("projectId", "userId", "stackName")
SELECT "projectId", "userId", "stackName" FROM "ProjectStack";

-- Drop old table
DROP TABLE "ProjectStack";

-- Rename new table
ALTER TABLE "ProjectStack_new" RENAME TO "ProjectStack";
