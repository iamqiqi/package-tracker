class TrackingRecordPolicy
  attr_reader :user, :tracking_record

  def initialize(user, tracking_record)
    @user = user
    @tracking_record = tracking_record
  end

  def create?
    !@user.nil?
  end

  def update?
    @tracking_record.user == user
  end

  def destroy?
    update?
  end
end
