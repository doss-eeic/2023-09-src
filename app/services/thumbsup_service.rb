# frozen_string_literal: true

class ThumbsupService < BaseService
  include Authorization
  include Payloadable

  # Thumbsup a status and notify remote user
  # @param [Account] account
  # @param [Status] status
  # @return [Thumbsup]
  def call(account, status)
    authorize_with account, status, :thumbsup?

    thumbsup = Thumbsup.find_by(account: account, status: status)

    return thumbsup unless thumbsup.nil?

    Thumbsup.create!(account: account, status: status)

    # Trends.statuses.register(status)

    # create_notification(thumbsup)
    # bump_potential_friendship(account, status)
  end

  private

  def build_json(thumbsup)
    Oj.dump(serialize_payload(thumbsup, ActivityPub::LikeSerializer))
  end
end
