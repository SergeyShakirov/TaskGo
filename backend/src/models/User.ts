import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Task } from './Task';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'client' | 'contractor';
  avatar?: string;
  rating?: number;
  completedTasks?: number;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'contractor';
  avatar?: string;
  rating?: number;
  completedTasks?: number;
  phone?: string;
  isVerified: boolean;
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [6, 255],
    },
  })
  password!: string;

  @Column({
    type: DataType.ENUM('client', 'contractor'),
    allowNull: false,
    defaultValue: 'client',
  })
  role!: 'client' | 'contractor';

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar?: string;

  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5,
    },
  })
  rating?: number;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  completedTasks!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      len: [10, 20],
    },
  })
  phone?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isVerified!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  // Associations
  @HasMany(() => Task, 'clientId')
  clientTasks!: Task[];

  @HasMany(() => Task, 'contractorId')
  contractorTasks!: Task[];
}
