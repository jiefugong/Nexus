require 'scraper/scraper.rb'

class HomeController < ApplicationController
	include Scraper

	# We have the ability to edit topics now, but it will not update on the React end because of how update returns
	# We are not capable of saving new notes yet (what if Note.find_by does not work?)
	def create
		@newEntry = Note.create(title: params[:title], entry: params[:entry], topic: params[:topic])
		@allNotes = Note.all
		render json: @allNotes
	end

	def edit
		@modifiedEntry = Note.find_by(title: params[:title])
		@modifiedEntry.entry = params[:entry]

		if @modifiedEntry.save
			@allNotes = Note.all
			render json: @allNotes
		else
			redirect_to root_path
		end
	end

	def delete
		@entryToDelete = Note.find_by(title: params[:title])

		if @entryToDelete.delete
			@allNotes = Note.all
			render json: @allNotes
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
