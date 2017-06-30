# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Note.destroy_all

Note.create!([{
		title: "Sample Title 1",
		topic: "Fitness",
		entry: "This is sample text"
		},
	{
		title: "Sample Title 2",
		topic: "Fitness",
		entry: "This is more sample text"
		},
	{
		title: "Sample Title 3",
		topic: "Gaming",
		entry: "This is not sample text"
		}])