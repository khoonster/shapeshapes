Shape Shapes
============

These are the files that make up [shapeshapes.com](http://shapeshapes.com)!

Development
===========

```
npm install
bundle
bower update
gulp vendor
bundle exec jekyll server
```

To view draft exhibitions, run `jekyll server` with the `--drafts` flag:

```
bundle exec jekyll server --drafts
```

Creating Exhibitions
====================

An "exhibition" post is an HTML file with any number of SVG elements included in the body. The following options are available for the front-matter, followed by the shapes, each contained in a separate SVG element:

```html
---
title: Filchner, 1999
artist: Khoon Choi
date: 2015-11-02 17:20:05
end_date: 2015-11-15 00:00:00 -0000
background: "#000099"
---

<svg xmlns="http://www.w3.org/2000/svg" version="1" x="0" y="0" width="310" height="310" viewBox="0 0 310 310" enable-background="new 0 0 310 310" xml:space="preserve"><polygon fill="#DCDCDC" points="165 181 154 180 150 179 148 178 143 175 139 172 136 170 133 169 125 164 123 153 123 150 125 146 136 137 137 135 140 132 150 130 153 130 157 130 172 135 173 138 173 141 174 145 175 147 180 150 180 151 182 153 185 158 187 161 187 166 185 171 184 174 180 175 179 176 175 177 170 177 167 178 165 181 165 181 165 181 "/></svg>
<svg xmlns="http://www.w3.org/2000/svg" version="1" x="0" y="0" width="310" height="310" viewBox="0 0 310 310" enable-background="new 0 0 310 310" xml:space="preserve"><polygon fill="#DCDCDC" points="145 175 142 169 141 164 141 160 144 149 146 147 149 142 154 130 157 124 158 122 160 122 163 123 165 126 168 130 168 134 167 139 166 146 166 153 167 155 170 160 166 176 164 181 161 186 159 187 154 188 152 186 "/></svg>
<!-- Possible many more SVGs ... -->
```

An import script is included in this repository for creating new exhibitions from a folder of SVG files (such as those generated from Adobe Illustrator).

Run the import script with the name of the exhibition and the path to the folder:

```bash
bin/import "My Exhibition Name" ~/path/to/my/svgs
```
