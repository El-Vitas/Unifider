// Components
export { default as WorkshopCard } from './components/WorkshopCard';
export { default as WorkshopForm } from './components/WorkshopForm';
export { default as SectionCard } from './components/SectionCard';
export { default as SectionForm } from './components/SectionForm';

// Pages
export { default as WorkshopAdmin } from './pages/WorkshopAdmin';
export { default as WorkshopUser } from './pages/WorkshopUser';
export { default as WorkshopDetail } from './pages/WorkshopDetail';
export { default as SectionAdmin } from './pages/SectionAdmin';

export { useWorkshops } from './hooks/useWorkshops';
export { useDeleteWorkshop } from './hooks/useDeleteWorkshop';
export { useDeleteSection } from './hooks/useDeleteSection';

export type {
  Workshop,
  WorkshopWithSections,
  Section,
  SectionTimeSlot,
  CreateWorkshopDto,
  UpdateWorkshopDto,
  CreateSectionDto,
  UpdateSectionDto,
} from './entities';
