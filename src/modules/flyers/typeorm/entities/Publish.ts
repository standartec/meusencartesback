import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('publish')
export default class Publish {

    @PrimaryColumn()
    id: string;

    @Column()
    description: string;

    @Column()
    date: Date;

    @Column()
    id_user: number;

    @Column()
    id_template: number;

    @Column()
    status: number;

    @Column()
    header2: string;
}