class SanitizedSVG

  DELETIONS = [
    /^---.*---\n/m,
    /^<!\-\-.*\-\->/m,
    /^<\?xml version="1\.0" encoding="utf\-8"\?>/,
    /id=".*?"/
  ]

  attr_reader :source

  def initialize source
    @source = source
  end

  def to_s
    DELETIONS.each_with_object(source) do |d, text|
      text.gsub!(d, '')
    end
  end

end
