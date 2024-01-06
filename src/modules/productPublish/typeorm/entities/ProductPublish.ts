import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("product_publish")
export default class ProductPublish {

    @PrimaryColumn()
    id: number;

    @Column()
    id_product_customer: number;

    @Column()
    id_publish: number;

    @Column()
    product_price: number;

    @Column()
    date: Date;

    @Column()
    status: number;

    @Column()
    dt_status: Date;

}