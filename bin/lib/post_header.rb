class PostHeader

  attr_accessor :title, :date

  def initialize title:, date:
    @title = title
    @date = date
  end

  def to_s
    <<-HEAD
---
title: #{title}
date: #{date}
---
    HEAD
  end

end
