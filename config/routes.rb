Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'react#index'

  resources :tracking_records do
    get 'check', action: 'check', on: :member
  end

  resources :users, only: [:create, :show, :update, :destroy]

  resources :sessions, only: [:create]

  get '*path', to: 'react#index'
end
