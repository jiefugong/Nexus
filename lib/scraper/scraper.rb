module Scraper

	def self.retrieve_entries(subreddit)
		return Entry.where(subreddit: subreddit)
	end

	def self.scrape_subreddits(subreddits)
		Entry.delete_all 

		subreddits.each do |subreddit|
			self.scrape_subreddit(subreddit.subreddit)
			sleep 1
		end
	end

	def self.scrape_subreddit(subreddit="all")
		require 'open-uri'
		doc = Nokogiri::HTML(open("https://www.reddit.com/r/" + subreddit + "/", 'User-Agent' => 'Tempest'))

		entries = doc.css('.thing')
		entriesArray = []
		entries.each do |entry|
			title = entry.css('p.title>a').text
      		link = entry.css('p.title>a')[0]['href']
      		score = entry.css('.score')[1].text.to_i
      		completeEntry = Entry.create(subreddit: subreddit, title: title, link: link, score: score)
      	end
	end
end