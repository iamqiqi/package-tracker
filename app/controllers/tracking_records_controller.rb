class TrackingRecordsController < ApplicationController
  before_action :lookup_user_by_token

  def index
    tracking_records = current_user.tracking_records
    populated_records = tracking_records.map do |record|
      if record.carrier == 'fedex'
        tracking_info = FedExClient.find_tracking_info(record.tracking_num)
      elsif record.carrier == 'ups'
        tracking_info = UPSClient.find_tracking_info(record.tracking_num)
      elsif record.carrier == 'usps'
        tracking_info = USPSClient.find_tracking_info(record.tracking_num)
      end

      if tracking_info
        if tracking_info.scheduled_delivery_date
          estimate = tracking_info.scheduled_delivery_date
        elsif tracking_info.status.to_s == 'delivered'
          estimate = tracking_info.actual_delivery_date
        end
      end

      record.attributes.merge(tracking_info: tracking_info, editing_status: false, estimate: estimate )
    end

    populated_records.sort_by!{|r| r[:estimate] || Time.new(9999)}
    render json: { tracking_records: populated_records }
  end

  def create
    if params[:carrier] == 'fedex'
      tracking_info = FedExClient.find_tracking_info(params[:trackingNum])
    elsif params[:carrier] == 'ups'
      tracking_info = UPSClient.find_tracking_info(params[:trackingNum])
    elsif params[:carrier] == 'usps'
      tracking_info = USPSClient.find_tracking_info(params[:trackingNum])
    end

    if tracking_info
      new_tracking = TrackingRecord.create(user_id: current_user.id, carrier: params[:carrier], tracking_num: params[:trackingNum], note: params[:note])
    end

    render json: { tracking_info: tracking_info }
  end

  def update
    tracking_record = TrackingRecord.find(params[:id])
    authorize tracking_record
    tracking_record.note = params[:note]
    if tracking_record.save
      head status: 204
    else
      head status: 500
    end
  end

  def destroy
    tracking_record = TrackingRecord.find(params[:id])
    authorize tracking_record
    tracking_record.destroy
    head status: 204
  end
end
