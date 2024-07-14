import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'account_auth',
})
export class AccountAuth extends Model{
  @Column({
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  password: string;

}