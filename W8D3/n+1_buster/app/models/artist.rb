# == Schema Information
#
# Table name: artists
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Artist < ApplicationRecord
  has_many :albums,
    class_name: 'Album',
    foreign_key: :artist_id,
    primary_key: :id

  def n_plus_one_tracks
    albums = self.albums
    tracks_count = {}
    albums.each do |album|
      tracks_count[album.title] = album.tracks.length
    end

    tracks_count
  end

  def better_tracks_query
    # TODO: your code here
    albums_with_counts = self
      .albums
      .select("albums.title, COUNT(*) AS num_tracks")
      .joins(:tracks)
      .group("albums.id")

    tracks_count = {}
    albums_with_counts.each do |album| 
      tracks_count[album.title] = album.num_tracks
    end
    tracks_count
  end
end
