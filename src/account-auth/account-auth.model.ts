import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement, HasOne, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { EmailModel } from '../email/email.model';
import { AccountUserModel } from '../account-user/account-user.model';

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
  password: string;

  @HasOne(() => EmailModel, {
    foreignKey: 'accountAuthId',
  })
  recoveryKey: EmailModel;

  @ForeignKey(() => AccountUserModel)
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
  })
  accountUserId: number;

  @BelongsTo(() => AccountUserModel)
  accountUser: AccountUserModel;

}
