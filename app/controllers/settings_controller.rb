class SettingsController < ApplicationController
  def base
  	@subreddits = Subreddit.all
  end
end
