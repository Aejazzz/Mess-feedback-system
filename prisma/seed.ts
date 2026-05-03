import { PrismaClient } from "@prisma/client";

import { HOSTEL_BLOCKS, MEALS } from "../lib/constants";

const prisma = new PrismaClient();

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

async function main() {
  console.info("Seeding demo feedback...");
  await prisma.feedback.deleteMany({});

  const batch = Array.from({ length: 520 }).map(() => {
    const dt = new Date();
    dt.setDate(dt.getDate() - Math.floor(Math.random() * 21));
    const dateLabel = dt.toISOString().slice(0, 10);
    const dayLabel = dayNames[dt.getDay()];

    return {
      mealType: pick(MEALS),
      block: pick(HOSTEL_BLOCKS),
      studentType: Math.random() < 0.82 ? "National" : "International",
      rating: Math.min(5, Math.max(1, Math.round(2.3 + Math.random() * 2.4 + (Math.random() < 0.08 ? -1 : 0)))),
      date: dateLabel,
      day: dayLabel,
      createdAt: dt,
    };
  });

  await prisma.feedback.createMany({
    data: batch,
  });

  console.info(`Inserted ${batch.length} demo ratings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
