import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { AppDataSource } from '../src/database/data-source';
import { Sport } from '../src/sports/entities/sport.entity';
import { Venue } from '../src/venues/entities/venue.entity';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('Initializace databázového připojení...');
    await AppDataSource.initialize();
    console.log('✓ Databáze připojena');

    const sportRepo = AppDataSource.getRepository(Sport);
    const venueRepo = AppDataSource.getRepository(Venue);

    // Seed sports
    console.log('\nVytváření sportů...');
    const sports = [
      { id: 'badminton' as const, name: 'Badminton' },
      { id: 'padel' as const, name: 'Padel' },
      { id: 'squash' as const, name: 'Squash' },
    ];

    for (const sport of sports) {
      const existing = await sportRepo.findOne({ where: { id: sport.id } });
      if (!existing) {
        await sportRepo.save(sport);
        console.log(`✓ Sport vytvořen: ${sport.name}`);
      } else {
        console.log(`○ Sport již existuje: ${sport.name}`);
      }
    }

    // Seed venues
    console.log('\nVytváření sportovišť...');
    const venues = [
      {
        name: 'Vítkovice Aréna',
        city: 'Ostrava',
        sportIds: ['badminton'],
      },
      {
        name: 'Padel Club Poruba',
        city: 'Ostrava',
        sportIds: ['padel'],
      },
      {
        name: 'Squash centrum Fifejdy',
        city: 'Ostrava',
        sportIds: ['squash'],
      },
      {
        name: 'Ridera Sport',
        city: 'Ostrava',
        sportIds: ['badminton', 'padel', 'squash'],
      },
      {
        name: 'Sport Centrum Ostrava',
        city: 'Ostrava',
        sportIds: ['badminton', 'padel', 'squash'],
      },
      {
        name: 'SC Fajne',
        city: 'Ostrava',
        sportIds: ['badminton', 'padel', 'squash'],
      },
      {
        name: 'Trojhalí Karolina',
        city: 'Ostrava',
        sportIds: ['badminton', 'padel', 'squash'],
      },
      {
        name: 'CDU Sport',
        city: 'Ostrava',
        sportIds: ['badminton', 'padel', 'squash'],
      },
      {
        name: 'Badminton 365',
        city: 'Ostrava',
        sportIds: ['badminton'],
      },
      {
        name: 'SC Metalurg',
        city: 'Ostrava',
        sportIds: ['badminton', 'padel', 'squash'],
      },
      {
        name: 'TJ Ostrava (Varenská)',
        city: 'Ostrava',
        sportIds: ['badminton', 'padel', 'squash'],
      },
    ];

    for (const venueData of venues) {
      const existing = await venueRepo.findOne({
        where: { name: venueData.name, city: venueData.city },
        relations: ['sports'],
      });

      if (!existing) {
        const sportsEntities = await Promise.all(
          venueData.sportIds.map((sportId) => 
            sportRepo.findOne({ where: { id: sportId as 'badminton' | 'padel' | 'squash' } })
          ),
        );

        const validSports = sportsEntities.filter((s) => s !== null) as Sport[];

        if (validSports.length === 0) {
          console.log(`⚠ Sportoviště přeskočeno (žádné platné sporty): ${venueData.name}`);
          continue;
        }

        const venue = venueRepo.create({
          name: venueData.name,
          city: venueData.city,
          sports: validSports,
        });

        await venueRepo.save(venue);
        console.log(`✓ Sportoviště vytvořeno: ${venueData.name}`);
      } else {
        console.log(`○ Sportoviště již existuje: ${venueData.name}`);
      }
    }

    console.log('\n✓ Seeding dokončeno');
  } catch (error) {
    console.error('❌ Chyba při seedingu:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Databázové připojení ukončeno');
    }
  }
}

seedDatabase()
  .then(() => {
    console.log('\n✅ Seeding úspěšně dokončeno');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding selhal:', error);
    process.exit(1);
  });
