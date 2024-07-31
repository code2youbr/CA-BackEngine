import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { AccountAuthModel } from '../account-auth/account-auth.model';

@Table({
  tableName: 'email',
})

export class EmailModel extends Model{
  @PrimaryKey
  @ForeignKey(() => AccountAuthModel)
  @Column({
    type: DataTypes.INTEGER,
  })
  recovery_key: number;

  @BelongsTo(() => AccountAuthModel)
  accountAuth: AccountAuthModel;
}
