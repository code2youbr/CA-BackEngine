import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({
  tableName: 'account_auth',
})
export class AccountAuthModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataTypes.INTEGER,
  })
  id: number;

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  username: string;

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  password: string;

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  email: string
}
