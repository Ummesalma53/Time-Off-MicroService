import { Entity,PrimaryGeneratedColumn,Column,UpdateDateColumn } from "typeorm";

@Entity()
export class Balance{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    employeeId: string;

    @Column()
        locationId: string;

    @Column('float')
    totalDays: number;
    
    @Column('float',{default: 0})
    usedDays: number;

    @Column('float',{default: 0})
    pendingDays: number;

    @UpdateDateColumn()
    lastSyncedAt: Date;

}