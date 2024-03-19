import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    url: string;

    @ManyToOne(() => Product, (product) => product.images)
    product: Product;
}
