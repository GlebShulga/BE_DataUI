import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import initialData from "./initialData";

export class SeedDataSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    await initialData(em);
  }
}
