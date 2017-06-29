class AddScoreToEntry < ActiveRecord::Migration[5.0]
  def change
    add_column :entries, :score, :integer
  end
end
