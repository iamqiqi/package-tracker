class RenameNotes < ActiveRecord::Migration[5.0]
  def change
    rename_column :tracking_records, :notes, :note
  end
end
