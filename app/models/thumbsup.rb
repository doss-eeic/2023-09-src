# frozen_string_literal: true

# == Schema Information
#
# Table name: thumbsups
#
#  id         :bigint(8)        not null, primary key
#  account_id :bigint(8)        not null
#  status_id  :bigint(8)        not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Thumbsup < ApplicationRecord
  include Paginable

  update_index('statuses', :status)

  belongs_to :account, inverse_of: :thumbsups
  belongs_to :status,  inverse_of: :thumbsups

  validates :status_id, uniqueness: { scope: :account_id }
end
