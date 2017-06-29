Rails.application.routes.draw do
  get 'settings/base'

  get 'home/base'
  get 'settings', to: 'settings#base'

  root 'home#base'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
