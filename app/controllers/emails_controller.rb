require 'gmail'
require 'json'
require 'date'

class EmailsController < ApplicationController

	def authenticate
		emails_json = []
		email_login = ENV['GMAIL_LOGIN']
		email_password = ENV['GMAIL_PASS']

		Gmail.connect(email_login, email_password) do |gmail|

			if gmail.logged_in?
				gmail.inbox.emails(:unread, :on => DateTime.now.strftime('%Y-%m-%d')).each do |email|
					subject = email.subject
					sender = email.sender[0].mailbox
					sender_name = email.sender[0].name
					emails_json << { :subject => subject, :sender => sender, :name => sender_name}.to_json
				end

				render json: emails_json
			else
				render json: {}
			end
		end
	end
end
