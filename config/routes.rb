Rails.application.routes.draw do
  get 'settings/base'
  get 'home/base'

  post '/', to: 'home#update'

  get 'settings', to: 'settings#base'
  delete 'settings', to: 'settings#destroy'
  post 'settings', to: 'settings#create'

  root 'home#base'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
