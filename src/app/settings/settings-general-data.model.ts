export interface SettingsGeneralData {
  id: string;
  userId: string;
  clinicName: string;
  clinicOwner: string;
  clinicAddress: string;
  clinicEmail: string;
  clinicUrl: string;
  prc: string;
  ptr: string;
  s2: string;
  nobreak: boolean;
  clinicPhone: Contact[];
  clinicHours: Hour[];
  imagePath: string;
}

export interface Contact {
  contact: string;
}

export interface Hour {
  morningOpen: string;
  morningClose: string;
  afternoonOpen: string;
  afternoonClose: string;
}
