import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      name: 'admin',
    },
    create: {
      name: 'admin',
    },
  });

  await prisma.role.upsert({
    where: { name: 'user' },
    update: {
      name: 'user',
    },
    create: {
      name: 'user',
    },
  });

  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  const userRole = await prisma.role.findUnique({
    where: { name: 'user' },
  });
  if (!userRole) {
    throw new Error('User role not found');
  }

  if (!adminRole) {
    throw new Error('Admin role not found');
  }

  const hashedAdminPassword = await bcryptjs.hash('admin123', 10);
  const hashedUserPassword = await bcryptjs.hash('12345678', 10);

  await prisma.user.upsert({
    where: { email: 'admin@admin.cl' },
    update: {
      fullName: 'Admin User',
      password: hashedAdminPassword,
      role: {
        connect: { id: adminRole.id },
      },
    },
    create: {
      fullName: 'Admin User',
      email: 'admin@admin.cl',
      password: hashedAdminPassword,
      role: {
        connect: { id: adminRole.id },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: 'test@test.cl' },
    update: {
      fullName: 'test',
      password: hashedUserPassword,
      role: {
        connect: { id: adminRole.id },
      },
    },
    create: {
      fullName: 'Admin User',
      email: 'test@test.cl',
      password: hashedUserPassword,
      role: {
        connect: { id: userRole.id },
      },
    },
  });

  const userAdmin = await prisma.user.findUnique({
    where: { email: 'admin@admin.cl' },
  });

  if (!userAdmin) {
    throw new Error('Admin user not found');
  }

  await prisma.location.upsert({
    where: { name: 'Cancha 1' },
    update: {
      name: 'Cancha 1',
    },
    create: {
      name: 'Cancha 1',
    },
  });

  const location = await prisma.location.findUnique({
    where: { name: 'Cancha 1' },
  });

  if (!location) {
    throw new Error('Location not found');
  }

  await prisma.workshop.upsert({
    where: { name: 'Futbol' },
    update: {
      name: 'Futbol',
      description: 'Description of Workshop 1',
      user: {
        connect: { id: userAdmin.id },
      },
      imageUrl:
        'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?cs=srgb&dl=pexels-pixabay-274422.jpg&fm=jpg',
    },
    create: {
      name: 'Futbol',
      description: 'Description of Workshop 1',
      user: {
        connect: { id: userAdmin.id },
      },
      imageUrl:
        'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?cs=srgb&dl=pexels-pixabay-274422.jpg&fm=jpg',
    },
  });

  await prisma.workshop.upsert({
    where: { name: 'Basketball' },
    update: {
      name: 'Basketball',
      description: 'Description of Basketball',
      imageUrl:
        'https://cdn.nba.com/teams/uploads/sites/1610612754/2024/10/GettyImages-2180292158.jpg?im=Resize=(640)',
    },
    create: {
      name: 'Basketball',
      description: 'Description of Basketball',
      user: {
        connect: { id: userAdmin.id },
      },
      imageUrl:
        'https://cdn.nba.com/teams/uploads/sites/1610612754/2024/10/GettyImages-2180292158.jpg?im=Resize=(640)',
    },
  });

  await prisma.workshop.upsert({
    where: { name: 'Voleibol' },
    update: {
      name: 'Voleibol',
      description: 'Description of Voleibol',
      user: {
        connect: { id: userAdmin.id },
      },
      imageUrl:
        'https://cdn.britannica.com/95/190895-050-955A908C/volleyball-match-Italy-Russia-Milan-Volleyball-World.jpg',
    },
    create: {
      name: 'Voleibol',
      description: 'Description of Voleibol',
      user: {
        connect: { id: userAdmin.id },
      },
      imageUrl:
        'https://cdn.britannica.com/95/190895-050-955A908C/volleyball-match-Italy-Russia-Milan-Volleyball-World.jpg',
    },
  });
  const soccerWorkshop = await prisma.workshop.findUnique({
    where: { name: 'Futbol' },
  });
  const basketBallWorkshop = await prisma.workshop.findUnique({
    where: { name: 'Basketball' },
  });
  const volleyballWorkshop = await prisma.workshop.findUnique({
    where: { name: 'Voleibol' },
  });
  if (!soccerWorkshop) {
    throw new Error('Soccer workshop not found');
  }
  if (!basketBallWorkshop) {
    throw new Error('Basketball workshop not found');
  }
  if (!volleyballWorkshop) {
    throw new Error('Volleyball workshop not found');
  }
  const soccerSections = await prisma.section.createManyAndReturn({
    data: [
      {
        number: 201,
        instructor: 'Paulo Cazeres',
        capacity: 20,
        createdBy: userAdmin.id,
        workshopId: soccerWorkshop.id,
      },
      {
        number: 202,
        instructor: 'Maria Gomez',
        capacity: 20,
        createdBy: userAdmin.id,
        workshopId: soccerWorkshop.id,
      },
      {
        number: 203,
        instructor: 'Paulo Cazeres',
        capacity: 20,
        createdBy: userAdmin.id,
        workshopId: soccerWorkshop.id,
      },
    ],
  });

  const basketBallSections = await prisma.section.createManyAndReturn({
    data: [
      {
        number: 301,
        instructor: 'Sarah Johnson',
        capacity: 25,
        createdBy: userAdmin.id,
        workshopId: basketBallWorkshop.id,
      },
      {
        number: 302,
        instructor: 'James Smith',
        capacity: 25,
        createdBy: userAdmin.id,
        workshopId: basketBallWorkshop.id,
      },
      {
        number: 303,
        instructor: 'Emma Brown',
        capacity: 25,
        createdBy: userAdmin.id,
        workshopId: basketBallWorkshop.id,
      },
    ],
  });

  const volleyballSections = await prisma.section.createManyAndReturn({
    data: [
      {
        number: 401,
        instructor: 'Olivia Davis',
        capacity: 15,
        createdBy: userAdmin.id,
        workshopId: volleyballWorkshop.id,
      },
      {
        number: 402,
        instructor: 'Liam Wilson',
        capacity: 15,
        createdBy: userAdmin.id,
        workshopId: volleyballWorkshop.id,
      },
      {
        number: 403,
        instructor: 'Sophia Martinez',
        capacity: 15,
        createdBy: userAdmin.id,
        workshopId: volleyballWorkshop.id,
      },
    ],
  });

  await prisma.timeBlock.createManyAndReturn({
    data: [
      {
        startTime: new Date(2025, 2, 2, 16, 0),
        endTime: new Date(2025, 2, 2, 17, 0),
        capacity: soccerSections[0].capacity,
        locationId: location.id,
        sectionId: soccerSections[0].id,
      },
      {
        startTime: new Date(2025, 2, 4, 12, 0),
        endTime: new Date(2025, 2, 4, 13, 0),
        capacity: soccerSections[1].capacity,
        locationId: location.id,
        sectionId: soccerSections[1].id,
      },
      {
        startTime: new Date(2025, 2, 4, 17, 0),
        endTime: new Date(2025, 2, 4, 18, 0),
        capacity: soccerSections[2].capacity,
        locationId: location.id,
        sectionId: soccerSections[2].id,
      },
    ],
  });

  await prisma.timeBlock.createManyAndReturn({
    data: [
      {
        startTime: new Date(2025, 2, 3, 16, 0),
        endTime: new Date(2025, 2, 3, 17, 0),
        capacity: basketBallSections[0].capacity,
        locationId: location.id,
        sectionId: basketBallSections[0].id,
      },
      {
        startTime: new Date(2025, 2, 3, 17, 0),
        endTime: new Date(2025, 2, 3, 18, 0),
        capacity: basketBallSections[0].capacity,
        locationId: location.id,
        sectionId: basketBallSections[0].id,
      },
      {
        startTime: new Date(2025, 2, 4, 16, 0),
        endTime: new Date(2025, 2, 4, 17, 0),
        capacity: basketBallSections[1].capacity,
        locationId: location.id,
        sectionId: basketBallSections[1].id,
      },
      {
        startTime: new Date(2025, 2, 4, 12, 0),
        endTime: new Date(2025, 2, 4, 13, 0),
        capacity: basketBallSections[2].capacity,
        locationId: location.id,
        sectionId: basketBallSections[2].id,
      },
    ],
  });

  await prisma.timeBlock.createManyAndReturn({
    data: [
      {
        startTime: new Date(2025, 2, 3, 16, 0),
        endTime: new Date(2025, 2, 3, 17, 0),
        capacity: volleyballSections[0].capacity,
        locationId: location.id,
        sectionId: volleyballSections[0].id,
      },
      {
        startTime: new Date(2025, 2, 3, 17, 0),
        endTime: new Date(2025, 2, 3, 18, 0),
        capacity: volleyballSections[1].capacity,
        locationId: location.id,
        sectionId: volleyballSections[1].id,
      },
      {
        startTime: new Date(2025, 2, 4, 16, 0),
        endTime: new Date(2025, 2, 4, 17, 0),
        capacity: volleyballSections[2].capacity,
        locationId: location.id,
        sectionId: volleyballSections[2].id,
      },
    ],
  });
}

// async const createTimeBlocks = async (scheduleId: number, startTime: string, endTime: string): Promise<void>  => {
//   const start = new Date(startTime);
//   const end = new Date(endTime);

//   while (start <= end) {
//     const next = new Date(start);
//     next.setHours(start.getHours() + 1);
//     await prisma.timeBlock.upsert({
//       where: {
//         start: start,
//       },
//       update: {
//         start: start,
//         end: next,
//       },
//       create: {
//         start: start,
//         end: next,
//       },
//     });
//     start.setHours(start.getHours() + 1);
//   }
// }
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
