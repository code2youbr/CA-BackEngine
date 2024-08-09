import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { DescriptionType } from './types/descriptionType'
@Table({
  tableName: 'meals',
  timestamps: true,
})
export class MenuModel extends Model{
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  description: DescriptionType;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  available: boolean;
}
