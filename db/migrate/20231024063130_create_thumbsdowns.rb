# frozen_string_literal: true

class CreateThumbsdowns < ActiveRecord::Migration[7.0]
  def change
    create_table :thumbsdowns do |t|
      t.bigint :account_id, null: false
      t.bigint :status_id, null: false
      t.timestamps
    end
  end
end
