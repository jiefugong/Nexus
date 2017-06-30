require 'scraper/scraper.rb'

class HomeController < ApplicationController
	include Scraper

	def update
		@modifiedEntry = Note.find_by(title: params[:title])
		@modifiedEntry.entry = params[:entry]

		if @modifiedEntry.save
			render json: @modifiedEntry
		else
			redirect_to root_path
		end
	end

	def base
		# Setup for Reddit Module
		@subreddits = Subreddit.all
		Scraper::scrape_subreddits(@subreddits)
		@entriesArray = Entry.all

		# Setup for Notes Module
		@topics = Note.select("topic").distinct;
		# @activeTopic = @topics.first
		@activeTopic = "Fitness"
		@submissionsArray = Note.all
	end
end
