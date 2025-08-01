export interface Address {
  zipCode?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Contact {
  email?: string;
  ddd?: string;
  telephoneNumber?: string;
}

export interface Dependent {
  name?: string;
  cpf?: string;
  birthDate?: string;
  dependentType?: string;
}

export interface Person {
  id?: number;
  name: string;
  cpf: string;
  birthDate: string;
  nameMother: string;
  nameFather: string;
  addresses: Address[];
  contacts: Contact[];
  dependents: Dependent[];
} 