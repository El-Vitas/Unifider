export type WorkshopWithCount = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  _count: {
    sections: number;
  };
};
export interface Workshop {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopWithSections extends Workshop {
  sectionsCount: number;
}

export interface CreateWorkshopDto {
  name: string;
  description: string;
  imageUrl?: string;
  image?: FileList;
}

export interface UpdateWorkshopDto extends CreateWorkshopDto {
  id: string;
}

export interface Section {
  id: string;
  number: number;
  capacity: number;
  instructor?: string;
  description?: string;
  imageUrl?: string;
  workshopId: string;
  workshop?: Workshop;
  timeSlots: SectionTimeSlot[];
  bookingsCount: number;
  isBooked: boolean;
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
  workshopId?: string;
  image?: FileList;
}

export interface UpdateSectionDto extends CreateSectionDto {
  id: string;
}
