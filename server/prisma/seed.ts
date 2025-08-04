import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
const prisma = new PrismaClient();

// Map weekday strings to their numeric values (1=Monday, 7=Sunday)
const weekDayToNumber: { [key: string]: number } = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  domingo: 7,
};

// Helper function for section time slots that still use Date
function parseTimeToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(0);
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
}

async function main() {
  console.log('Starting database seeding...');

  // ===== ROLES =====
  console.log('Creating roles...');
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: { name: 'admin' },
    create: { name: 'admin' },
  });

  await prisma.role.upsert({
    where: { name: 'user' },
    update: { name: 'user' },
    create: { name: 'user' },
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const userRole = await prisma.role.findUnique({
    where: { name: 'user' },
  });

  if (!adminRole || !userRole) {
    throw new Error('Required roles not found');
  }

  // ===== USERS =====
  console.log('Creating users...');
  const hashedAdminPassword = await bcryptjs.hash('admin123', 10);
  const hashedUserPassword = await bcryptjs.hash('12345678', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@admin.cl' },
    update: {
      fullName: 'Admin User',
      password: hashedAdminPassword,
      roleId: adminRole.id,
    },
    create: {
      fullName: 'Admin User',
      email: 'admin@admin.cl',
      password: hashedAdminPassword,
      roleId: adminRole.id,
    },
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'test@test.cl' },
    update: {
      fullName: 'Test User',
      password: hashedUserPassword,
      roleId: userRole.id,
    },
    create: {
      fullName: 'Test User',
      email: 'test@test.cl',
      password: hashedUserPassword,
      roleId: userRole.id,
    },
  });

  // ===== LOCATIONS =====
  console.log('Creating locations...');

  const mainGym = await prisma.location.upsert({
    where: { name: 'gimnasio principal' },
    update: {
      description:
        'Edificio principal con gimnasio, canchas deportivas y salas multifunción',
      createdBy: adminUser.id,
    },
    create: {
      name: 'gimnasio principal',
      description:
        'Edificio principal con gimnasio, canchas deportivas y salas multifunción',
      createdBy: adminUser.id,
    },
  });

  const outdoorArea = await prisma.location.upsert({
    where: { name: 'area exterior' },
    update: {
      description: 'Espacio al aire libre con canchas de fútbol y tenis',
      createdBy: adminUser.id,
    },
    create: {
      name: 'area exterior',
      description: 'Espacio al aire libre con canchas de fútbol y tenis',
      createdBy: adminUser.id,
    },
  });

  const sandCourtLocation = await prisma.location.upsert({
    where: { name: 'cancha de arena - ubicacion' },
    update: {
      description:
        'Ubicación de la cancha de arena para voleibol y otros deportes',
      createdBy: adminUser.id,
    },
    create: {
      name: 'cancha de arena - ubicacion',
      description:
        'Ubicación de la cancha de arena para voleibol y otros deportes',
      createdBy: adminUser.id,
    },
  });

  // ===== GYMS =====
  console.log('Creating gyms...');

  // First create schedules
  const gymSchedule = await prisma.schedule.create({
    data: {},
  });

  const mainGymFacility = await prisma.gym.upsert({
    where: { name: 'gimnasio' },
    update: {
      description:
        'Instalación principal de entrenamiento con equipos de musculación',
      locationId: mainGym.id,
      createdBy: adminUser.id,
      scheduleId: gymSchedule.id,
    },
    create: {
      name: 'gimnasio',
      description:
        'Instalación principal de entrenamiento con equipos de musculación',
      locationId: mainGym.id,
      createdBy: adminUser.id,
      scheduleId: gymSchedule.id,
    },
  });

  // ===== COURTS =====
  console.log('Creating courts...');

  // Create schedules for courts
  const court1Schedule = await prisma.schedule.create({
    data: {},
  });

  const court2Schedule = await prisma.schedule.create({
    data: {},
  });

  const tennisSchedule = await prisma.schedule.create({
    data: {},
  });

  const volleyballCourtSchedule = await prisma.schedule.create({
    data: {},
  });

  const sandCourtSchedule = await prisma.schedule.create({
    data: {},
  });

  const basketballCourtSchedule = await prisma.schedule.create({
    data: {},
  });

  const court1 = await prisma.court.upsert({
    // Used later for SectionTimeSlot locationId and court1Schedule
    where: { name: 'pasto sintetico 1' },
    update: {
      description: 'Cancha de fútbol con pasto sintético',
      locationId: outdoorArea.id,
      createdBy: adminUser.id,
      scheduleId: court1Schedule.id,
    },
    create: {
      name: 'pasto sintetico 1',
      description: 'Cancha de fútbol con pasto sintético',
      locationId: outdoorArea.id,
      createdBy: adminUser.id,
      scheduleId: court1Schedule.id,
    },
  });

  // No assignment needed if variable not used
  await prisma.court.upsert({
    // Used later for court2Schedule
    where: { name: 'pasto sintetico 2' },
    update: {
      description: 'Segunda cancha de fútbol con pasto sintético',
      locationId: outdoorArea.id,
      createdBy: adminUser.id,
      scheduleId: court2Schedule.id,
    },
    create: {
      name: 'pasto sintetico 2',
      description: 'Segunda cancha de fútbol con pasto sintético',
      locationId: outdoorArea.id,
      createdBy: adminUser.id,
      scheduleId: court2Schedule.id,
    },
  });

  // No assignment needed if variable not used
  await prisma.court.upsert({
    // Used later for tennisSchedule
    where: { name: 'cancha de tenis' },
    update: {
      description: 'Cancha de tenis profesional',
      locationId: outdoorArea.id,
      createdBy: adminUser.id,
      scheduleId: tennisSchedule.id,
    },
    create: {
      name: 'cancha de tenis',
      description: 'Cancha de tenis profesional',
      locationId: outdoorArea.id,
      createdBy: adminUser.id,
      scheduleId: tennisSchedule.id,
    },
  });

  // No assignment needed if variable not used
  await prisma.court.upsert({
    where: { name: 'cancha de voleibol' },
    update: {
      description: 'Cancha de voleibol interior',
      locationId: mainGym.id,
      createdBy: adminUser.id,
      scheduleId: volleyballCourtSchedule.id,
    },
    create: {
      name: 'cancha de voleibol',
      description: 'Cancha de voleibol interior',
      locationId: mainGym.id,
      createdBy: adminUser.id,
      scheduleId: volleyballCourtSchedule.id,
    },
  });

  // No assignment needed if variable not used
  await prisma.court.upsert({
    where: { name: 'cancha de arena' },
    update: {
      description: 'Cancha de voleibol de arena',
      locationId: sandCourtLocation.id,
      createdBy: adminUser.id,
      scheduleId: sandCourtSchedule.id,
    },
    create: {
      name: 'cancha de arena',
      description: 'Cancha de voleibol de arena',
      locationId: sandCourtLocation.id,
      createdBy: adminUser.id,
      scheduleId: sandCourtSchedule.id,
    },
  });

  // No assignment needed if variable not used
  await prisma.court.upsert({
    where: { name: 'cancha de basketball' },
    update: {
      description: 'Cancha de basketball interior',
      locationId: mainGym.id,
      createdBy: adminUser.id,
      scheduleId: basketballCourtSchedule.id,
    },
    create: {
      name: 'cancha de basketball',
      description: 'Cancha de basketball interior',
      locationId: mainGym.id,
      createdBy: adminUser.id,
      scheduleId: basketballCourtSchedule.id,
    },
  });

  // ===== EQUIPMENT =====
  console.log('Creating equipment...');
  const equipment1 = await prisma.equipment.upsert({
    where: { name: 'polea' },
    update: {
      description: 'Equipo de polea para entrenamiento de espalda y brazos',
      createdBy: adminUser.id,
    },
    create: {
      name: 'polea',
      description: 'Equipo de polea para entrenamiento de espalda y brazos',
      createdBy: adminUser.id,
    },
  });

  const equipment2 = await prisma.equipment.upsert({
    where: { name: 'press banca' },
    update: {
      description: 'Equipo para entrenamiento de pecho y brazos',
      createdBy: adminUser.id,
    },
    create: {
      name: 'press banca',
      description: 'Equipo para entrenamiento de pecho y brazos',
      createdBy: adminUser.id,
    },
  });

  const equipment3 = await prisma.equipment.upsert({
    where: { name: 'mancuernas' },
    update: {
      description: 'Set de mancuernas de diferentes pesos',
      createdBy: adminUser.id,
    },
    create: {
      name: 'mancuernas',
      description: 'Set de mancuernas de diferentes pesos',
      createdBy: adminUser.id,
    },
  });

  const equipment4 = await prisma.equipment.upsert({
    where: { name: 'cinta de correr' },
    update: {
      description: 'Equipo de cardio para entrenamiento aeróbico',
      createdBy: adminUser.id,
    },
    create: {
      name: 'cinta de correr',
      description: 'Equipo de cardio para entrenamiento aeróbico',
      createdBy: adminUser.id,
    },
  });

  // ===== GYM EQUIPMENT RELATION =====
  console.log('Assigning equipment to gyms...');
  await prisma.gymEquipment.upsert({
    where: {
      gymId_equipmentId: {
        gymId: mainGymFacility.id,
        equipmentId: equipment1.id,
      },
    },
    update: { quantity: 3 },
    create: {
      gymId: mainGymFacility.id,
      equipmentId: equipment1.id,
      quantity: 3,
    },
  });

  await prisma.gymEquipment.upsert({
    where: {
      gymId_equipmentId: {
        gymId: mainGymFacility.id,
        equipmentId: equipment2.id,
      },
    },
    update: { quantity: 2 },
    create: {
      gymId: mainGymFacility.id,
      equipmentId: equipment2.id,
      quantity: 2,
    },
  });

  await prisma.gymEquipment.upsert({
    where: {
      gymId_equipmentId: {
        gymId: mainGymFacility.id,
        equipmentId: equipment3.id,
      },
    },
    update: { quantity: 10 },
    create: {
      gymId: mainGymFacility.id,
      equipmentId: equipment3.id,
      quantity: 10,
    },
  });

  await prisma.gymEquipment.upsert({
    where: {
      gymId_equipmentId: {
        gymId: mainGymFacility.id,
        equipmentId: equipment4.id,
      },
    },
    update: { quantity: 4 },
    create: {
      gymId: mainGymFacility.id,
      equipmentId: equipment4.id,
      quantity: 4,
    },
  });

  // ===== SCHEDULE TIME BLOCKS =====
  console.log('Creating schedule time blocks...');

  // Gym schedule - valid domain time blocks
  const gymTimeBlocks = [
    { start: '08:15', end: '08:50' },
    { start: '08:50', end: '09:25' },
    { start: '09:35', end: '10:10' },
    { start: '10:10', end: '10:45' },
    { start: '10:55', end: '11:30' },
    { start: '11:30', end: '12:05' },
    { start: '12:15', end: '12:50' },
    { start: '12:50', end: '13:25' },
    { start: '14:30', end: '15:05' },
    { start: '15:05', end: '15:40' },
    { start: '15:50', end: '16:25' },
    { start: '16:25', end: '17:00' },
    { start: '17:10', end: '17:45' },
    { start: '17:45', end: '18:20' },
    { start: '18:30', end: '19:05' },
    { start: '19:05', end: '19:40' },
    { start: '19:50', end: '20:25' },
    { start: '20:25', end: '21:00' },
    { start: '21:10', end: '21:45' },
    { start: '21:45', end: '22:20' },
  ];

  // Create gym schedule blocks for weekdays (1-5)
  for (let day = 1; day <= 5; day++) {
    for (const timeBlock of gymTimeBlocks) {
      await prisma.scheduleTimeBlock.create({
        data: {
          scheduleId: gymSchedule.id,
          dayOfWeek: day,
          startTime: timeBlock.start,
          endTime: timeBlock.end,
          capacity: 30,
          isEnabled: true,
        },
      });
    }
  }

  // Create gym schedule blocks for weekends (6-7) - reduced hours
  const weekendTimeBlocks = gymTimeBlocks.filter(
    (block) => block.start >= '08:15' && block.end <= '18:20',
  );

  for (let day = 6; day <= 7; day++) {
    for (const timeBlock of weekendTimeBlocks) {
      await prisma.scheduleTimeBlock.create({
        data: {
          scheduleId: gymSchedule.id,
          dayOfWeek: day,
          startTime: timeBlock.start,
          endTime: timeBlock.end,
          capacity: 20,
          isEnabled: true,
        },
      });
    }
  }

  // Create court schedule blocks
  const courtTimeBlocks = [
    { start: '08:15', end: '09:25' },
    { start: '09:35', end: '10:45' },
    { start: '10:55', end: '12:05' },
    { start: '12:15', end: '13:25' },
    { start: '14:30', end: '15:40' },
    { start: '15:50', end: '17:00' },
    { start: '17:10', end: '18:20' },
    { start: '18:30', end: '19:40' },
    { start: '19:50', end: '21:00' },
    { start: '21:10', end: '22:20' },
  ];

  for (let day = 1; day <= 7; day++) {
    // Court 1 schedule
    for (const timeBlock of courtTimeBlocks) {
      await prisma.scheduleTimeBlock.create({
        data: {
          scheduleId: court1Schedule.id,
          dayOfWeek: day,
          startTime: timeBlock.start,
          endTime: timeBlock.end,
          capacity: 1,
          isEnabled: true,
        },
      });
    }

    // Court 2 schedule
    for (const timeBlock of courtTimeBlocks) {
      await prisma.scheduleTimeBlock.create({
        data: {
          scheduleId: court2Schedule.id,
          dayOfWeek: day,
          startTime: timeBlock.start,
          endTime: timeBlock.end,
          capacity: 1,
          isEnabled: true,
        },
      });
    }

    // Tennis schedule
    const tennisTimeBlocks = courtTimeBlocks.filter(
      (block) => block.start >= '08:15' && block.end <= '18:20',
    );

    for (const timeBlock of tennisTimeBlocks) {
      await prisma.scheduleTimeBlock.create({
        data: {
          scheduleId: tennisSchedule.id,
          dayOfWeek: day,
          startTime: timeBlock.start,
          endTime: timeBlock.end,
          capacity: 1,
          isEnabled: true,
        },
      });
    }
  }

  // ===== WORKSHOPS =====
  console.log('Creating workshops...');

  const soccerWorkshop = await prisma.workshop.upsert({
    where: { name: 'futbol' },
    update: {
      description: 'Taller deportivo de fútbol',
      createdBy: adminUser.id,
      imageUrl:
        'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?cs=srgb&dl=pexels-pixabay-274422.jpg&fm=jpg',
    },
    create: {
      name: 'futbol',
      description: 'Taller deportivo de fútbol',
      createdBy: adminUser.id,
      imageUrl:
        'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?cs=srgb&dl=pexels-pixabay-274422.jpg&fm=jpg',
    },
  });

  const basketballWorkshop = await prisma.workshop.upsert({
    where: { name: 'basketball' },
    update: {
      description: 'Taller deportivo de basketball',
      createdBy: adminUser.id,
      imageUrl:
        'https://cdn.nba.com/teams/uploads/sites/1610612754/2024/10/GettyImages-2180292158.jpg?im=Resize=(640)',
    },
    create: {
      name: 'basketball',
      description: 'Taller deportivo de basketball',
      createdBy: adminUser.id,
      imageUrl:
        'https://cdn.nba.com/teams/uploads/sites/1610612754/2024/10/GettyImages-2180292158.jpg?im=Resize=(640)',
    },
  });

  const volleyballWorkshop = await prisma.workshop.upsert({
    where: { name: 'voleibol' },
    update: {
      description: 'Taller deportivo de voleibol',
      createdBy: adminUser.id,
      imageUrl:
        'https://cdn.britannica.com/95/190895-050-955A908C/volleyball-match-Italy-Russia-Milan-Volleyball-World.jpg',
    },
    create: {
      name: 'voleibol',
      description: 'Taller deportivo de voleibol',
      createdBy: adminUser.id,
      imageUrl:
        'https://cdn.britannica.com/95/190895-050-955A908C/volleyball-match-Italy-Russia-Milan-Volleyball-World.jpg',
    },
  });

  // ===== SECTIONS =====
  console.log('Creating workshop sections...');

  const defaultSectionCapacity = 20;

  const soccerSections = [
    await prisma.section.create({
      data: {
        number: 201,
        instructor: 'Paulo Cazeres',
        description: 'Sección inicial de fútbol, nivel principiante',
        workshopId: soccerWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
    await prisma.section.create({
      data: {
        number: 202,
        instructor: 'Maria Gomez',
        description: 'Sección avanzada de fútbol',
        workshopId: soccerWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
    await prisma.section.create({
      data: {
        number: 203,
        instructor: 'Carlos Ramirez',
        description: 'Sección táctica de fútbol',
        workshopId: soccerWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
  ];

  const basketballSections = [
    await prisma.section.create({
      data: {
        number: 301,
        instructor: 'Sarah Johnson',
        description: 'Fundamentos de basketball',
        workshopId: basketballWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
    await prisma.section.create({
      data: {
        number: 302,
        instructor: 'James Smith',
        description: 'Técnicas avanzadas de basketball',
        workshopId: basketballWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
    await prisma.section.create({
      data: {
        number: 303,
        instructor: 'Emma Brown',
        description: 'Entrenamiento intensivo de basketball',
        workshopId: basketballWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
  ];

  const volleyballSections = [
    await prisma.section.create({
      data: {
        number: 401,
        instructor: 'David Lee',
        description: 'Fundamentos de voleibol indoor',
        workshopId: volleyballWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
    await prisma.section.create({
      data: {
        number: 402,
        instructor: 'Laura Wilson',
        description: 'Voleibol de playa',
        workshopId: volleyballWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
    await prisma.section.create({
      data: {
        number: 403,
        instructor: 'Michael Clark',
        description: 'Técnicas avanzadas de voleibol',
        workshopId: volleyballWorkshop.id,
        createdBy: adminUser.id,
        capacity: defaultSectionCapacity,
      },
    }),
  ];

  // ===== SECTION TIME SLOTS =====
  console.log('Creating section time slots...');

  // Assign time slots needed for bookings later
  const soccerTimeSlot1 = await prisma.sectionTimeSlot.create({
    data: {
      sectionId: soccerSections[0].id, // Links to the first soccer section
      locationId: court1.locationId, // Uses the location of court1
      dayOfWeek: weekDayToNumber['lunes'],
      startTime: parseTimeToDate('16:00'),
      endTime: parseTimeToDate('17:30'),
    },
  });

  // No assignment needed if variable not used
  await prisma.sectionTimeSlot.create({
    data: {
      sectionId: soccerSections[1].id,
      locationId: court1.locationId,
      dayOfWeek: weekDayToNumber['lunes'],
      startTime: parseTimeToDate('17:30'),
      endTime: parseTimeToDate('19:00'),
    },
  });

  // No assignment needed if variable not used
  await prisma.sectionTimeSlot.create({
    data: {
      sectionId: soccerSections[2].id,
      locationId: court1.locationId,
      dayOfWeek: weekDayToNumber['jueves'],
      startTime: parseTimeToDate('15:00'),
      endTime: parseTimeToDate('16:30'),
    },
  });

  // No assignment needed if variable not used
  await prisma.sectionTimeSlot.create({
    data: {
      sectionId: basketballSections[0].id,
      locationId: mainGym.id,
      dayOfWeek: weekDayToNumber['miercoles'],
      startTime: parseTimeToDate('18:30'),
      endTime: parseTimeToDate('20:00'),
    },
  });

  // Assign time slots needed for bookings later
  const basketballTimeSlot2 = await prisma.sectionTimeSlot.create({
    data: {
      sectionId: basketballSections[1].id, // Links to the second basketball section
      locationId: mainGym.id,
      dayOfWeek: weekDayToNumber['martes'],
      startTime: parseTimeToDate('19:30'),
      endTime: parseTimeToDate('21:00'),
    },
  });

  // No assignment needed if variable not used
  await prisma.sectionTimeSlot.create({
    data: {
      sectionId: basketballSections[2].id,
      locationId: mainGym.id,
      dayOfWeek: weekDayToNumber['jueves'],
      startTime: parseTimeToDate('10:30'),
      endTime: parseTimeToDate('12:00'),
    },
  });

  // No assignment needed if variable not used
  await prisma.sectionTimeSlot.create({
    data: {
      sectionId: volleyballSections[0].id,
      locationId: mainGym.id,
      dayOfWeek: weekDayToNumber['viernes'],
      startTime: parseTimeToDate('10:00'),
      endTime: parseTimeToDate('11:30'),
    },
  });

  // No assignment needed if variable not used
  await prisma.sectionTimeSlot.create({
    data: {
      sectionId: volleyballSections[1].id,
      locationId: sandCourtLocation.id,
      dayOfWeek: weekDayToNumber['viernes'],
      startTime: parseTimeToDate('12:00'),
      endTime: parseTimeToDate('13:30'),
    },
  });

  // No assignment needed if variable not used
  await prisma.sectionTimeSlot.create({
    data: {
      sectionId: volleyballSections[2].id,
      locationId: mainGym.id,
      dayOfWeek: weekDayToNumber['sabado'],
      startTime: parseTimeToDate('14:00'),
      endTime: parseTimeToDate('15:30'),
    },
  });

  // ===== CREATE SOME SAMPLE BOOKINGS =====
  console.log('Creating sample bookings...');

  if (normalUser) {
    // Use the time slots which contain the sectionId we need
    const soccerBookingSlot = soccerTimeSlot1;
    const basketballBookingSlot = basketballTimeSlot2;

    if (soccerBookingSlot) {
      const nextMonday = new Date();
      const currentDay = nextMonday.getDay();
      const targetDay = 1;
      const daysToAdd = (targetDay - currentDay + 7) % 7;
      nextMonday.setDate(
        nextMonday.getDate() + daysToAdd + (daysToAdd <= 0 ? 7 : 0),
      );
      nextMonday.setHours(0, 0, 0, 0);

      await prisma.sectionBooking.create({
        // CORRECTED: Use sectionId from the time slot, as SectionBooking relates to Section
        data: {
          sectionId: soccerBookingSlot.sectionId, // Correct FK
          userId: normalUser.id,
          bookingDate: nextMonday,
        },
      });
      console.log(
        `Created soccer booking for ${normalUser.email} (Section ID: ${soccerBookingSlot.sectionId}) on ${nextMonday.toDateString()}`,
      );
    } else {
      console.warn('Could not find soccer time slot 1 to create booking.');
    }

    if (basketballBookingSlot) {
      const nextTuesday = new Date();
      const currentDay = nextTuesday.getDay();
      const targetDay = 2;
      const daysToAdd = (targetDay - currentDay + 7) % 7;
      nextTuesday.setDate(
        nextTuesday.getDate() + daysToAdd + (daysToAdd <= 0 ? 7 : 0),
      );
      nextTuesday.setHours(0, 0, 0, 0);

      await prisma.sectionBooking.create({
        // CORRECTED: Use sectionId from the time slot, as SectionBooking relates to Section
        data: {
          sectionId: basketballBookingSlot.sectionId, // Correct FK
          userId: normalUser.id,
          bookingDate: nextTuesday,
        },
      });
      console.log(
        `Created basketball booking for ${normalUser.email} (Section ID: ${basketballBookingSlot.sectionId}) on ${nextTuesday.toDateString()}`,
      );
    } else {
      console.warn('Could not find basketball time slot 2 to create booking.');
    }

    // Create gym bookings (ScheduledBooking - check FK name)
    const gymTimeBlock = await prisma.scheduleTimeBlock.findFirst({
      where: {
        scheduleId: gymSchedule.id,
        dayOfWeek: weekDayToNumber['miercoles'],
      },
    });

    if (gymTimeBlock) {
      const nextWednesday = new Date();
      const currentDay = nextWednesday.getDay();
      const targetDay = 3;
      const daysToAdd = (targetDay - currentDay + 7) % 7;
      nextWednesday.setDate(
        nextWednesday.getDate() + daysToAdd + (daysToAdd <= 0 ? 7 : 0),
      );
      nextWednesday.setHours(0, 0, 0, 0);

      await prisma.scheduledBooking.create({
        data: {
          scheduleTimeBlockId: gymTimeBlock.id, // Corrected FK name
          userId: normalUser.id,
          bookingDate: nextWednesday,
        },
      });
      console.log(
        `Created gym booking for ${normalUser.email} on ${nextWednesday.toDateString()}`,
      );
    } else {
      console.warn(
        'Could not find a gym time block for Wednesday to create booking.',
      );
    }
  } else {
    console.warn('Test user not found, skipping sample bookings.');
  }

  console.log('Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding failed:');
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
