import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('product_customer')
export default class ProductCustomer {

    @PrimaryColumn()
    id: number;

    @Column()
    id_user: number;

    @Column()
    id_product: number;

    @Column()
    price: number;

    @Column()
    date: Date;


}