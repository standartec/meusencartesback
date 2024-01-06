import OrdersProducts from '@modules/orders/typeorm/entities/OrdersProducts';
import ProductCustomer from '@modules/productCustomer/typeorm/entities/ProductCustomer';
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('products')

class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => ProductCustomer, product_customer => product_customer.id_product, {
        cascade: true,
    })
    product_customer: ProductCustomer[];
   
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    id_owner: number;

    @Column()
    id_cathegory: number;

    @Column()
    image_link: string;

    @Column()
    bar_code: string;

    @Column()
    status: number;

    @Column()
    image_name_origin: string;

    @Column()
    image_width: string;

    @Column()
    image_height: string;

    @Column()
    shop_type: string;

    @Column()
    ean: string;

    @Column()
    ncm: string;

    @Column()
    cathegory_desc: string;

    @Column()
    cest: string;

    @Column()
    image_status: string;

    @Column()
    date_creation: string;


}

export default Product;