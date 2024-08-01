import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement, HasOne } from 'sequelize-typescript';
import { EmailModel } from '../email/email.model';

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
  email: string;

  @Column({
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean;

  @HasOne(() => EmailModel, {
    foreignKey: 'accountAuthId',
  })
  recoveryKey: EmailModel;

}
