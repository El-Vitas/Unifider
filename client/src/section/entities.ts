export interface Section {
  id: string;
  number: number;
  capacity: number;
  instructor?: string;
  description?: string;
  imageUrl?: string;
  workshopId: string;
  workshop?: {
    id: string;
    name: string;
    description: string;
  };
  timeSlots?: SectionTimeSlot[];
  bookingsCount?: number;
  isBooked?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectionTimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  sectionId: string;
  location?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface CreateSectionDto {
  number: number;
  capacity: number;
  instructor?: string;
  description?: string;
  workshopId: string;
  image?: FileList;
}

export interface UpdateSectionDto extends CreateSectionDto {
  id: string;
}
