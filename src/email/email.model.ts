import { DataTypes } from 'sequelize';
import { Column, Model, Table, PrimaryKey, AllowNull } from 'sequelize-typescript';

@Table({
  tableName: 'email',
})

export class EmailModel extends Model{
  @PrimaryKey
  @AllowNull
  @Column({
    type: DataTypes.INTEGER,
  })
  recovery_key: number;

}
