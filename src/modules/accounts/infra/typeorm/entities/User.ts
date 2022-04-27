import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('users')
class User {
  @PrimaryColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public password: string;

  @Column()
  public email: string;

  @Column()
  public driver_license: string;

  @Column()
  public isAdmin: boolean;

  @Column()
  public avatar: string;

  @CreateDateColumn()
  public created_at: Date;

  @Expose({ name: 'avatar_url' })
  avatar_url(): string {
    switch (process.env.disk) {
      case 'local':
        return `${process.env.APP_API_URL}/avatar/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { User };
