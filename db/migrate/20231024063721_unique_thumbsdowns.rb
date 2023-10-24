# frozen_string_literal: true

class UniqueThumbsdowns < ActiveRecord::Migration[7.0]
  disable_ddl_transaction!

  def change
    add_index :thumbsdowns, [:status_id, :account_id], unique: true, algorithm: :concurrently
  end
end
