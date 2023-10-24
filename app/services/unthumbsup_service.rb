# frozen_string_literal: true

class UnthumbsupService < BaseService
  include Payloadable

  def call(account, status)
    thumbsup = thumbsup.find_by!(account: account, status: status)
    thumbsup.destroy!
    # create_notification(thumbsup) if !status.account.local? && status.account.activitypub?
    thumbsup
  end

  private

  # def create_notification(thumbsup)
  # status = thumbsup.status
  # ActivityPub::DeliveryWorker.perform_async(build_json(thumbsup), thumbsup.account_id, status.account.inbox_url)
  # end

  def build_json(thumbsup)
    Oj.dump(serialize_payload(thumbsup, ActivityPub::UndoLikeSerializer))
  end
end
