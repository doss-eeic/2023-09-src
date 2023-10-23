# frozen_string_literal: true

class Api::V1::Statuses::ThumbsupsController < Api::BaseController
  include Authorization

  before_action :require_user!
  before_action :set_status, only: [:create]

  def create
    ThumbsupService.new.call(current_account, @status)
    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    up = current_account.thumbsups.find_by(status_id: params[:status_id])

    if up
      @status = up.status
      UnthumbsupWorker.perform_async(current_account.id, @status.id)
    else
      @status = Status.find(params[:status_id])
      authorize @status, :show?
    end

    relationships = StatusRelationshipsPresenter.new([@status], current_account.id, thumbsups_map: { @status.id => false })
    render json: @status, serializer: REST::StatusSerializer, relationships: relationships
  rescue Mastodon::NotPermittedError
    not_found
  end

  private

  def set_status
    @status = Status.find(params[:status_id])
    authorize @status, :show?
  rescue Mastodon::NotPermittedError
    not_found
  end
end
