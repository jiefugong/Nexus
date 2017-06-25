class CreateEntries < ActiveRecord::Migration[5.0]
  def change
    create_table :entries do |t|
      t.string :subreddit
      t.string :title
      t.text :link

      t.timestamps
    end
  end
end
