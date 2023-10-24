# frozen_string_literal: true

class CreateThumbsup < ActiveRecord::Migration[7.0]
  def change
    create_table :thumbsups do |t|
      t.bigint :account_id, null: false
      t.bigint :status_id, null: false

      t.timestamps
    end
  end
end
