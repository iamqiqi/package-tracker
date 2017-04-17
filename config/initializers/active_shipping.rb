::FedExClient = ActiveShipping::FedEx.new(
  login: Rails.application.secrets.fedex_login,
  password: Rails.application.secrets.fedex_password,
  key: Rails.application.secrets.fedex_key,
  account: Rails.application.secrets.fedex_account,
  test: !Rails.env.production?
)

::UPSClient = ActiveShipping::UPS.new(
  key: Rails.application.secrets.ups_key,
  login: Rails.application.secrets.ups_login,
  password: Rails.application.secrets.ups_password,
  test: !Rails.env.production?
)

::USPSClient = ActiveShipping::USPS.new(
  login: Rails.application.secrets.usps_login
)
