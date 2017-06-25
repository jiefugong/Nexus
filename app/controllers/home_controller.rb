require 'scraper/scraper.rb'

class HomeController < ApplicationController
	include Scraper


	# TODO
	# View defaults to a few certain saved subreddits (database is seeded)
	# Allow new subreddits to be added, have a box with multiple tabs
	# one for each added subreddit that contains some of the top posts
	# 
	# Essentially, a mini Reddit of the most important headlines 
	# Optionally, create a digest later
	# 
	# 1. Create Model for subscribed subreddits
	# 2. Seed database with defaults 
	# 3. Create form or button for adding subreddits
	# 4. Create top 10
	def base
		@subreddits = Subreddit.all
		Scraper::scrape_subreddits(@subreddits)
		@entriesArray = Entry.where(subreddit: 'popular')
	end
end
