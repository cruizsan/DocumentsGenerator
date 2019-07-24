import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Documents {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        type: "varchar",
        length: 150
    })
    name: string;

    @Column({
        unique: true,
        type: "varchar",
        length: 150
    })
    originalname: string;

    @Column()
    path: string;

}
