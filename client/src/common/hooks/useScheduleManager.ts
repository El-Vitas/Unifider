import { useState, useEffect, useCallback, useMemo } from 'react';
import { httpAdapter } from '../adapters/httpAdapter';
import { customToast } from '../utils/customToast';
import config from '../../config';
import { useAsync } from './useAsync';
import type { CustomHttpResponse } from '../types';

interface ScheduleBlock {
  id: number;
  start: string;
  end: string;
}

interface UseScheduleManagerProps {
  authToken: string | null;
}

interface UseScheduleManagerReturn {
  scheduleByDay: Record<string, boolean[]>;
  capacityByDay: Record<string, Record<number, number>>;
  scheduleData: CustomHttpResponse<ScheduleBlock[]> | null;
  scheduleLoading: boolean;
  scheduleError: string | null;
  isScheduleModalOpen: boolean;
  setScheduleByDay: (schedule: Record<string, boolean[]>) => void;
  setCapacityByDay: (capacity: Record<string, Record<number, number>>) => void;
  openScheduleModal: () => void;
  closeScheduleModal: () => void;
  onScheduleChange: (schedule: Record<string, boolean[]>) => void;
  onCapacityChange: (capacity: Record<string, Record<number, number>>) => void;
}

export const useScheduleManager = ({
  authToken,
}: UseScheduleManagerProps): UseScheduleManagerReturn => {
  const [scheduleByDay, setScheduleByDay] = useState<Record<string, boolean[]>>(
    {},
  );
  const [capacityByDay, setCapacityByDay] = useState<
    Record<string, Record<number, number>>
  >({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const urlDefaultSchedule = useMemo(
    () => `${config.apiUrl}/schedule/default`,
    [],
  );

  const fetchDefaultScheduleFn = useCallback(() => {
    if (!authToken) {
      throw new Error('No auth token available');
    }
    return httpAdapter.get<ScheduleBlock[]>(urlDefaultSchedule, {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });
  }, [urlDefaultSchedule, authToken]);

  const {
    data: scheduleData,
    loading: scheduleLoading,
    error: scheduleError,
    execute: fetchDefaultSchedule,
  } = useAsync<CustomHttpResponse<ScheduleBlock[]>>(
    fetchDefaultScheduleFn,
    'Failed to fetch Default Schedule',
  );

  useEffect(() => {
    fetchDefaultSchedule();
  }, [fetchDefaultSchedule]);

  useEffect(() => {
    if (scheduleError) {
      customToast.error(scheduleError);
    }
  }, [scheduleError]);

  useEffect(() => {
    if (scheduleData?.data) {
      // Initialize schedule by day with all blocks available (true) for each day
      const daysOfWeek = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const initialSchedule: Record<string, boolean[]> = {};
      daysOfWeek.forEach((day) => {
        initialSchedule[day] = Array(scheduleData.data.length).fill(true);
      });
      setScheduleByDay(initialSchedule);

      // Initialize capacity for each day and block with default value
      const initialCapacity: Record<string, Record<number, number>> = {};
      daysOfWeek.forEach((day) => {
        initialCapacity[day] = {};
        scheduleData.data.forEach((block: ScheduleBlock) => {
          initialCapacity[day][block.id] = 20; // Default capacity
        });
      });
      setCapacityByDay(initialCapacity);
    }
  }, [scheduleData]);

  const openScheduleModal = useCallback(() => {
    setIsScheduleModalOpen(true);
  }, []);

  const closeScheduleModal = useCallback(() => {
    setIsScheduleModalOpen(false);
  }, []);

  const onScheduleChange = useCallback(
    (schedule: Record<string, boolean[]>) => {
      setScheduleByDay(schedule);
    },
    [],
  );

  const onCapacityChange = useCallback(
    (capacity: Record<string, Record<number, number>>) => {
      setCapacityByDay(capacity);
    },
    [],
  );

  return {
    scheduleByDay,
    capacityByDay,
    scheduleData,
    scheduleLoading,
    scheduleError,
    isScheduleModalOpen,
    setScheduleByDay,
    setCapacityByDay,
    openScheduleModal,
    closeScheduleModal,
    onScheduleChange,
    onCapacityChange,
  };
};
