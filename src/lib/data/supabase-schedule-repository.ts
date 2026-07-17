import type { SupabaseClient } from '@supabase/supabase-js';
import type { HouseholdSchedules } from '@/lib/summer-schedule';

export class SupabaseScheduleRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async load(householdId: string): Promise<HouseholdSchedules> {
    const { data, error } = await this.supabase
      .from('households')
      .select('schedules')
      .eq('id', householdId)
      .single();

    if (error) throw error;
    return Array.isArray(data?.schedules) ? (data.schedules as HouseholdSchedules) : [];
  }

  async save(householdId: string, schedules: HouseholdSchedules): Promise<void> {
    const { error } = await this.supabase
      .from('households')
      .update({ schedules })
      .eq('id', householdId);

    if (error) throw error;
  }
}
