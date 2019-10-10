export interface EncountersData {
  id: string;
  userId: string;
  created: Date;
  status: boolean;

  label: string;
  year: number;
  canceled: number;
  done: number;
  count: number;
}
