import { Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { initialData } from './data/seed.data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        private readonly productService: ProductService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async runSeed() {
        await this.deleteTables();
        const user = await this.insertNewUser();
        await this.insertNewProducts(user);

        return `Seed Executed`;
    }

    private async deleteTables() {
        await this.productService.deleteAllProduct();

        const queyBuilder = this.userRepository.createQueryBuilder();

        await queyBuilder.delete().where({}).execute();
    }

    private async insertNewUser() {
        const SeedUsers = initialData.users;

        const users: User[] = [];

        SeedUsers.forEach((user) => {
            users.push(this.userRepository.create(user));
        });

        const dbUsers = await this.userRepository.save(SeedUsers);

        return dbUsers[0];
    }

    private async insertNewProducts(user: User) {
        await this.productService.deleteAllProduct();

        const products = initialData.products;

        const insertPromises = [];

        products.forEach((product) => {
            insertPromises.push(this.productService.create(product, user));
        });

        await Promise.all(insertPromises);

        return true;
    }
}
