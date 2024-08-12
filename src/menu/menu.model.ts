import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement, HasOne, ForeignKey } from 'sequelize-typescript';
import { AccountUserModel } from '../account-user/account-user.model';

@Table({
  tableName: 'menu',
})
export class MenuModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataTypes.INTEGER,
  })
  id: number

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  name: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  description: string

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  image: string


  @Column({
    allowNull: false,
    type: DataTypes.NUMBER,
  })
  price: number

  @Column({
    allowNull: false,
    defaultValue: true,
    type: DataTypes.BOOLEAN,
  })
  available: boolean
}
