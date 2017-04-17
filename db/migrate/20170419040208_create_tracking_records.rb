class CreateTrackingRecords < ActiveRecord::Migration[5.0]
  def change
    create_table :tracking_records do |t|
      t.string :user_id, null:false
      t.string :tracking_num, null: false
      t.string :carrier, null: false
      t.string :notes

      t.timestamps
    end
    add_index :tracking_records, :tracking_num, unique: true
  end
end
