export interface Person {
  id?: number;
  name: string;
  cpf: string;
  rg?: string;
  rgIssuer?: string;
  birthDate: string;
  nameMother?: string;
  nameFather?: string;
  maritalStatus?: string;
  profession?: string;
  nationality?: string;
  gender?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  addresses: Address[];
  contacts: Contact[];
  dependents: Dependent[];
}

export interface Address {
  id?: number;
  street?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  zipCode?: string;
  country?: string;
  number?: string;
}

export interface Contact {
  id?: number;
  email?: string;
  ddd?: string;
  telephoneNumber?: string;
}

export interface Dependent {
  id?: number;
  name?: string;
  cpf?: string;
  birthDate?: string;
  dependentType?: string;
}

export interface MaritalStatus {
  value: string;
  label: string;
}

export interface Gender {
  value: string;
  label: string;
} 