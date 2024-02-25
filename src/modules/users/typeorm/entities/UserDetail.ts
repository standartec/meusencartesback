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

    @Column()
    beta_tester: string;

    @Column()
    image_height_big: string;

    @Column()
    image_width_big: string;

    @Column()
    image_address: string;

    @Column()
    mobile_number_user: string; 
    
    @Column()
    footer_text3: string; 
    
    @Column()
    header_text: string; 
    
    @Column()
    size_logo: number; 
    
    @Column()
    logo_heigh: number; 
    
    @Column()
    logo_width: number; 
    
    @Column()
    header2: string;
}