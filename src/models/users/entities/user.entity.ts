import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  username: string

  @Column({ select: false })
  password: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date

  @Column({ nullable: true})
  reset_token: string
}
