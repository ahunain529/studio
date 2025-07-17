export interface Receivable {
  id: string;
  payer: string;
  amount: number;
}

export interface Payable {
  id: string;
  payee: string;
  amount: number;
  dueDate: Date;
}

export interface Purchase {
  id: string;
  notes: string;
  summary?: string;
  category?: string;
  quantity?: number;
  price?: number;
  dealerContactInfo?: string;
}

export interface DealerContact {
  id: string;
  name: string;
  contactInfo: string;
}
