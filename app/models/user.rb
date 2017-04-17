class User < ApplicationRecord
  has_secure_password

  has_many :tracking_records, dependent: :destroy

  validates :username, presence: true, uniqueness: true
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }

  def as_json(options={})
    super(except: [:password_digest, :updated_at, :created_at])
  end
end
