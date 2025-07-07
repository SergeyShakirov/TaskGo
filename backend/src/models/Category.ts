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

export interface CategoryAttributes {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreationAttributes {
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
    },
  })
  icon!: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive!: boolean;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sortOrder!: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  // Associations
  @HasMany(() => Task, 'categoryId')
  tasks!: Task[];
}
