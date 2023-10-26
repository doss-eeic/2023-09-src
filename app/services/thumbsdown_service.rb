# frozen_string_literal: true

class ThumbsdownService < BaseService
  include Authorization
  include Payloadable

  # Thumbsdown a status and notify remote user
  # @param [Account] account
  # @param [Status] status
  # @return [Thumbsdown]
  def call(account, status)
    authorize_with account, status, :thumbsdown?

    thumbsdown = Thumbsdown.find_by(account: account, status: status)

    return thumbsdown unless thumbsdown.nil?

    Thumbsdown.create!(account: account, status: status)

    # Trends.statuses.register(status)

    # create_notification(thumbsdown)
    # bump_potential_friendship(account, status)
  end

  private

  def build_json(thumbsdown)
    Oj.dump(serialize_payload(thumbsdown, ActivityPub::LikeSerializer))
  end
end
