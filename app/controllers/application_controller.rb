class ApplicationController < ActionController::API
  include Pundit

  def lookup_user_by_token
    hmac_secret = Rails.application.secrets.hmac_secret
    token = params[:token]
    decoded_token = JWT.decode token, hmac_secret, true, { :algorithm => 'HS256' }
    id = decoded_token[0]['sub']
    @user = User.find(id)
  end

  def current_user
    @user
  end
end
