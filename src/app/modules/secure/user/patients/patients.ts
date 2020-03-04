import { Physicians } from '../physicians/physicians';

export interface Labels {
  label: string;
}

export interface Patients {
    id: string;
    physicians: Physicians[];
    labels: Labels[];
}

