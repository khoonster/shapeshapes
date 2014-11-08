module Jekyll
  class SvgConverter < Converter
    safe true
    priority :high
    
    def matches ext
      ext =~ /^\.svg/
    end
    
    def output_ext ext
      ext
    end
    
    def convert content
      content.gsub! /^\<\?xml.*\n/, ''
      content.gsub! /^\<\!--.*\n/, ''
      content.gsub! /^\<\!DOCTYPE.*\n/, ''
      content.gsub! /id=".*?"\s/, ''
      content.gsub! /\t/, '  '
      content
    end
  end
end
