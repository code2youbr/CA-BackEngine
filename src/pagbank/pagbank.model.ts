import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AutoIncrement, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AccountUserModel } from '../account-user/account-user.model';

interface OrderInfo {
  totalAmount: number;
  foodIdentifiers: string;
}

@Table({
  tableName: 'pagbank',
})

export class PagBankModel extends Model {
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
  pagbankId: string

  @Column({
    allowNull: false,
    type: DataTypes.JSONB,
  })
  orderInfo: OrderInfo

  @Column({
    allowNull: false,
    type: DataTypes.STRING,
  })
  identifier: string

  @ForeignKey(() => AccountUserModel)
  @Column({
    type: DataTypes.INTEGER,
  })
  accountUserId: number;

  @BelongsTo(() => AccountUserModel)
  user: AccountUserModel;



}
