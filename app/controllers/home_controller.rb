require 'scraper/scraper.rb'

class HomeController < ApplicationController
	include Scraper

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
