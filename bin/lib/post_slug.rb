require 'active_support/all'

class PostSlug

  attr_accessor :raw, :time

  def initialize stringish, time = Time.now
    @raw = stringish
    @time = time
  end

  def name
    ActiveSupport::Inflector.parameterize(raw)
  end

  def to_s
    "#{time.strftime('%Y-%m-%d')}-#{name}"
  end

end
