-- CreateTable
CREATE TABLE "public"."balances" (
    "id" TEXT NOT NULL,
    "account_id_from" TEXT NOT NULL,
    "account_id_to" TEXT NOT NULL,
    "balance_account_id_from" DOUBLE PRECISION NOT NULL,
    "balance_account_id_to" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balances_pkey" PRIMARY KEY ("id")
);
