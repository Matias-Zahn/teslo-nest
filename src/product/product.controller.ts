import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/auth.entity';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
        return this.productService.create(createProductDto, user);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.productService.findAll(paginationDto);
    }

    @Get(':term')
    findOne(@Param('term', ParseUUIDPipe) term: string) {
        return this.productService.findOne(term);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto,
        @GetUser() user: User,
    ) {
        return this.productService.update(id, updateProductDto, user);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.productService.remove(id);
    }
}
