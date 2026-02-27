export class Product {

    id: string;
    name: string;
    description?: string;
    price: number;
    currency: 'DOP' | 'USD';
    imageUrl?: string;
    category?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
