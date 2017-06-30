class CreateNotes < ActiveRecord::Migration[5.0]
  def change
    create_table :notes do |t|
      t.string :title
      t.string :topic
      t.text :entry

      t.timestamps
    end
  end
end
