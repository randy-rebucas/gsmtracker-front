import { Physicians } from '../physicians/physicians';

export interface Patients {
    id: string;
    physicians: Physicians[];
}

