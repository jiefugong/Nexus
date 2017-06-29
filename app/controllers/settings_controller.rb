class SettingsController < ApplicationController

  def create
  	# Add to the list of subscribed Subreddits
  	if !Subreddit.exists?(subreddit: params[:subreddit])
  		Subreddit.create(subreddit: params[:subreddit])
  		@subreddits = Subreddit.all
  		render json: @subreddits
  	else
  		redirect_to settings_path
  	end
  end

  def destroy
  	# Destroy the subreddit if it exists  	
  	if Subreddit.exists?(subreddit: params[:subreddit])
  		Subreddit.find_by(subreddit: params[:subreddit]).destroy

  		# Return remaining subreddits
  		@subreddits = Subreddit.all
  		render json: @subreddits 
  	else
  		redirect_to settings_path
  	end
  end

  def base
  	@subreddits = Subreddit.all
  end
end
