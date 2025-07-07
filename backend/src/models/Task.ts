import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './User';
import { Category } from './Category';

export interface TaskAttributes {
  id: string;
  title: string;
  shortDescription: string;
  aiGeneratedDescription?: string;
  estimatedHours?: number;
  estimatedCost?: number;
  actualHours?: number;
  actualCost?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  deadline?: Date;
  clientId: string;
  contractorId?: string;
  categoryId: string;
  requirements?: string[];
  deliverables?: string[];
  milestones?: string[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreationAttributes {
  title: string;
  shortDescription: string;
  aiGeneratedDescription?: string;
  estimatedHours?: number;
  estimatedCost?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  deadline?: Date;
  clientId: string;
  contractorId?: string;
  categoryId: string;
  requirements?: string[];
  deliverables?: string[];
  milestones?: string[];
  attachments?: string[];
}

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model<TaskAttributes, TaskCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [5, 200],
    },
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      len: [10, 1000],
    },
  })
  shortDescription!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  aiGeneratedDescription?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 10000,
    },
  })
  estimatedHours?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  })
  estimatedCost?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  })
  actualHours?: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0,
    },
  })
  actualCost?: number;

  @Default('medium')
  @Column({
    type: DataType.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
  })
  priority!: 'low' | 'medium' | 'high' | 'urgent';

  @Default('draft')
  @Column({
    type: DataType.ENUM('draft', 'pending', 'in_progress', 'completed', 'cancelled'),
    allowNull: false,
  })
  status!: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deadline?: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  clientId!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  contractorId?: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  categoryId!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  requirements?: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  deliverables?: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  milestones?: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  attachments?: string[];

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  // Associations
  @BelongsTo(() => User, 'clientId')
  client!: User;

  @BelongsTo(() => User, 'contractorId')
  contractor?: User;

  @BelongsTo(() => Category, 'categoryId')
  category!: Category;
}
