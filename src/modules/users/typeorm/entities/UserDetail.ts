import { Column, Entity, PrimaryColumn } from "typeorm";
         
@Entity('user_detail')
export default class UserDetail {

    @PrimaryColumn()
    id: number;

    @Column()
    id_user: number;
    
    @Column()
    mobile_number: number;

    @Column()
    address: string;

    @Column()
    footer_text: string;

    @Column()
    footer_text2: string;

    @Column()
    image_link: string;

    @Column()
    image_name_origin: string;

    @Column()
    company_name: string;

    @Column()
    city: string;

    @Column()
    shop_type: string;

    @Column()
    image_height: string;

    @Column()
    image_width: string;


}