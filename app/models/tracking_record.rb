class TrackingRecord < ApplicationRecord
  belongs_to :user

  validates :user_id, presence: true
  validates :tracking_num, presence: true, uniqueness: true
end
