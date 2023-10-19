# frozen_string_literal: true

class Thumbsup1 < ActiveRecord::Migration[7.1]
  def change
    create_table :thumbsups do |t|
      t.bigint :account_id, null: false
      t.bigint :status_id, null: false
      t.timestamps null: false
    end
    add_column :statuses, :thumbsups_count, :integer, null: false, default: 0
    add_column :status_stats, :thumbsups_count, :integer, null: false, default: 0
    add_index :thumbsups, [:account_id, :status_id, :id], unique: true
  end
end
