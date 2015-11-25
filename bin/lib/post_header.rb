class PostHeader

  attr_accessor :data

  def initialize data = {}
    @data = data
  end

  def to_s
    <<-HEAD
---
#{data.map {|k, v| "#{k}: #{v}"}.join("\n")}
---
    HEAD
  end

end
