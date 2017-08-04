Rails.application.routes.draw do
  resources :events
  get 'settings/base'
  get 'home/base'

  patch '/', to: 'home#edit'
  post '/', to: 'home#create'
  delete '/', to: 'home#delete'

  get 'settings', to: 'settings#base'
  delete 'settings', to: 'settings#destroy'
  post 'settings', to: 'settings#create'

  root 'home#base'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
