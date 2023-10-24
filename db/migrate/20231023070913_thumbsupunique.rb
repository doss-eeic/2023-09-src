# frozen_string_literal: true

class Thumbsupunique < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def change
    add_index :thumbsups, [:status_id, :account_id], unique: true, algorithm: :concurrently
  end
end
