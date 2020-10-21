# Migration `20201021163111-initial`

This migration has been generated by Ali Zahid at 10/21/2020, 9:31:11 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
"id" SERIAL,
"email" text   NOT NULL ,
"name" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Account" (
"id" SERIAL,
"name" text   NOT NULL ,
"amount" Decimal(65,30)   NOT NULL DEFAULT 0,
"currency" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Item" (
"id" SERIAL,
"accountId" integer   NOT NULL ,
"userId" integer   NOT NULL ,
"amount" Decimal(65,30)   NOT NULL ,
"date" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"description" text   NOT NULL ,
"type" text   NOT NULL ,
"createdAt" timestamp(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" timestamp(3)   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."_AccountToUser" (
"A" integer   NOT NULL ,
"B" integer   NOT NULL
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

CREATE UNIQUE INDEX "_AccountToUser_AB_unique" ON "public"."_AccountToUser"("A", "B")

CREATE INDEX "_AccountToUser_B_index" ON "public"."_AccountToUser"("B")

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("accountId")REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_AccountToUser" ADD FOREIGN KEY ("A")REFERENCES "public"."Account"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_AccountToUser" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201021163111-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,54 @@
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+generator client {
+  provider        = "prisma-client-js"
+  previewFeatures = ["atomicNumberOperations"]
+}
+
+model User {
+  id Int @id @default(autoincrement())
+
+  email String @unique
+  name  String
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  accounts Account[]
+  items    Item[]
+}
+
+model Account {
+  id Int @id @default(autoincrement())
+
+  name     String
+  amount   Float  @default(0)
+  currency String
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+
+  items Item[]
+  users User[]
+}
+
+model Item {
+  id Int @id @default(autoincrement())
+
+  account   Account @relation(fields: [accountId], references: [id])
+  accountId Int
+
+  user   User @relation(fields: [userId], references: [id])
+  userId Int
+
+  amount      Float
+  date        DateTime @default(now())
+  description String
+  type        String
+
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+}
```