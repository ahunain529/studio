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
  summary: string;
  quantity: number;
  dealerContactInfo: string;
}

export interface DealerContact {
  id: string;
  name: string;
  contactInfo: string;
}
