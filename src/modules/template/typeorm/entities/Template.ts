import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('template')
export default class Template {

    @PrimaryColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    header_image: string;

    @Column()
    footer_image: string;

    @Column()
    complete_image: string;

    @Column()
    logo: string;

    @Column()
    footer_text: string;

    @Column()
    header_left_text: string;

    @Column()
    badge_image: string;

    @Column()
    id_user: string;

    @Column()
    header_text_right: string;

    @Column()
    footer_text2: string;

    @Column()
    template_type: string;

    @Column()
    has_logo: string;

    @Column()
    has_left_text: string;

    @Column()
    has_right_text: string;

    @Column()
    has_footer_text: string;

    @Column()
    main_color: string;

    @Column()
    status: string;

    @Column()
    font_color: number;

    @Column()
    id_model: number;

    @Column()
    id_model_type: number;
}