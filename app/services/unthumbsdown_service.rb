# frozen_string_literal: true

class UnthumbsdownService < BaseService
  include Payloadable

  def call(account, status)
    thumbsdown = Thumbsdown.find_by!(account: account, status: status)
    thumbsdown.destroy!
    # create_notification(thumbsdown) if !status.account.local? && status.account.activitypub?
    thumbsdown
  end

  private

  # def create_notification(thumbsdown)
  # status = thumbsdown.status
  # ActivityPub::DeliveryWorker.perform_async(build_json(thumbsdown), thumbsdown.account_id, status.account.inbox_url)
  # end

  def build_json(thumbsdown)
    Oj.dump(serialize_payload(thumbsdown, ActivityPub::UndoLikeSerializer))
  end
end
