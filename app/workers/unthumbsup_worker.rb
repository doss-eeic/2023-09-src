# frozen_string_literal: true

class UnthumbsupWorker
  include Sidekiq::Worker

  def perform(account_id, status_id)
    UnthumbsupService.new.call(Account.find(account_id), Status.find(status_id))
  rescue ActiveRecord::RecordNotFound
    true
  end
end
