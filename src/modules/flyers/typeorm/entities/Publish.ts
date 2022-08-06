import { Column, Entity } from "typeorm";

@Entity('publish')
export default class Publish {

    @Column()
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