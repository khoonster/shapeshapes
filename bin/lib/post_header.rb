class PostHeader

  attr_accessor :name, :time

  def initialize name:, time:
    @name = name
    @time = time
  end

  def to_s
    <<-HEAD
---
title: #{name.inspect}
date: #{time.strftime('%Y-%m-%d %X')}
---
    HEAD
  end

end
