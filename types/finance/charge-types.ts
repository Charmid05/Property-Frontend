import { TimeStamped } from "./common";

export interface ChargeType extends TimeStamped {
  id: number;
  name: string;
  description: string;
  frequency: 'one_time' | 'recurring' | 'usage_based';
  is_system_charge: boolean;
  is_active: boolean;
}
