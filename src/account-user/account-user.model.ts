import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement, HasOne, ForeignKey } from 'sequelize-typescript';
import { EmailModel } from '../email/email.model';
import { AccountAuthModel } from '../account-auth/account-auth.model';

@Table({
  tableName: 'account_user',
})
export class AccountUserModel extends Model {
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
  email: string

  @Column({
    allowNull: false,
    type: DataTypes.NUMBER,
  })
  telephoneNumber: number

  @Column({
    allowNull: false,
    type: DataTypes.NUMBER,
  })
  cpfCnpj: number

  @Column({
    allowNull: false,
    type: DataTypes.BOOLEAN,
  })
  isLegalPerson: boolean

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isAdmin: boolean

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean

  @HasOne(() => AccountAuthModel, {
    foreignKey: 'accountUserId',
  })
  accountUserId: AccountAuthModel;
}
