export interface Users {
    id: string;
    name: Name;
    gender: string;
    birthdate: string;
    contact: string;
    createdAt: Date;
    updatedAt: Date;
    addresses: Address[];
    age: number;
    publicKey: string;
    privateKey: string;
    avatar?: string;
}

export interface Address {
    current: boolean;
    address1: string;
    address2: string;
    city: string;
    province: string;
    postalCode: number;
    country: string;
}

export interface Name {
    firstname: string;
    midlename: string;
    lastname: string;
}

