module Scraper

	class ScoreLinter
		def return_subreddit_score(score)
			if score.end_with?('k')
				# Score is above the ten thousand threshold
				score = score.slice(0, score.length - 1)
				score_thousands, score_hundreds = score.split('.')
				total_score = score_thousands.to_i * 1000 + score_hundreds.to_i * 100
				return total_score
			else
				return score.to_i
			end
		end
	end

	def self.retrieve_entries(subreddit)
		return Entry.where(subreddit: subreddit)
	end

	def self.scrape_subreddits(subreddits)
		Entry.delete_all 

		subreddits.each do |subreddit|
			self.scrape_subreddit(subreddit.subreddit)
		end
	end

	def self.scrape_subreddit(subreddit="all")
		require 'open-uri'
		linter = ScoreLinter.new
		doc = Nokogiri::HTML(open("https://www.reddit.com/r/" + subreddit + "/", 'User-Agent' => 'Tempest'))

		entries = doc.css('.thing')
		entriesArray = []
		entries.each do |entry|
			title = entry.css('p.title>a').text
      		link = entry.css('p.title>a')[0]['href']
      		score = linter.return_subreddit_score(entry.css('.score')[1].text)
      		completeEntry = Entry.create(subreddit: subreddit, title: title, link: link, score: score)
      	end
	end
end