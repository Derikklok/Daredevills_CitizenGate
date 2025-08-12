import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SystemAdmin{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    username: string;

}