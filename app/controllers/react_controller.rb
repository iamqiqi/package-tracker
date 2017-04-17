class ReactController < ActionController::Base
  def index
    render layout: 'application'
  end
end
