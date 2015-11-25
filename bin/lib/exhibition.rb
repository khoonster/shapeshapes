require 'sanitized_svg'

class Exhibition

  attr_reader :header, :source

  def initialize header: '', source: []
    @header = header
    @source = source
  end

  def write(path)
    File.open(path, "w") do |file|
      file << header

      source.each do |filepath|
        file << SanitizedSVG.new(File.read(filepath))
      end
    end
  end

end
