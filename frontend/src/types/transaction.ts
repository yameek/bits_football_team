export interface Transaction {
  id: number;
  member_id: number;
  session_id?: number;
  category_id?: number;
  transaction_type: TransactionType;
  amount: string;
  balance_after: string;
  method: 'cash' | 'bank' | 'mobile';
  notes?: string;
  created_at: string;
  member?: {
    id: number;
    name: string;
  };
}

export type TransactionType =
  | 'contribution'
  | 'session_fee'
  | 'onfield_payment'
  | 'refund'
  | 'adjustment'
  | 'bulk_payment'
  | 'fine'
  | 'surcharge';

export interface BulkPaymentDto {
  payingMemberId: number;
  beneficiaryIds: number[];
  amounts: number[];
  method: 'cash' | 'bank' | 'mobile';
  splitType: 'equal' | 'custom';
  notes?: string;
}
