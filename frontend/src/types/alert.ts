export interface Alert {
  id: number;
  alert_type: AlertType;
  member_id?: number;
  message: string;
  is_resolved: boolean;
  resolved_at?: string;
  triggered_at: string;
  member?: {
    id: number;
    name: string;
  };
}

export type AlertType =
  | 'treasury_low'
  | 'member_low_balance'
  | 'fine_applied'
  | 'consecutive_absence';

export interface ResolveAlertDto {
  notes?: string;
}
