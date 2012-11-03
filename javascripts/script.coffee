width = self.innerWidth - 10
height = self.innerHeight - 10
	
window.drawTree = (insta) ->
	div = d3.select("#chart").append("div")
		.style("position", "absolute")
		.style("width", width + "px")
		.style("height", height + "px")
		.style("top", "50%")
		.style("left", "50%")
		.style("margin", -.5*height + "px 0 0 " + -.5*width + "px")
		
	treemap = d3.layout.treemap()
		.size([width, height])
		.sticky(true)
		.value((d) -> d.size)
	
	json = {
		"children": []
	}
	
	for pic in insta.data
		detail = {
			"src": pic.images.standard_resolution.url,
			"size": pic.likes.count,
			"url": pic.link,
			"title": if pic.caption then pic.caption.text else ""
		}
		json.children.push(detail)
	
	div.data([json]).selectAll("div")
		.data(treemap.nodes)
		.enter().append("div")
		.attr("class", "cell")
		.call(cell)
		.style("background-image", (d) -> if d.children then null else "url('#{d.src}')")
		.html((d) ->
			if d.children
				return null
			else if d.url
				return "<a href='#{d.url}' data-url='#{d.src}' title='#{d.title}'></a>"
		)
		.style("-webkit-transition", ->
			num = Math.random()
			time = "0.5s"
			return "#{time} opacity #{num}s"
		)
		
	window.zoom = new Zoom "z"
	window.setTimeout =>
		for box in document.getElementsByClassName "cell"
			box.className = "cell visible"
			if box.childNodes.length isnt 0
				a = box.firstChild
				a.addEventListener "mouseover", cacheImage, false
				a.addEventListener "click", handleZoom, false
	, 0
		
cell = ->
	this
		.style("left", (d) -> d.x + "px")
		.style("top", (d) -> d.y + "px")
		.style("width", (d) -> Math.max(0, d.dx - 1) + "px")
		.style("height", (d) -> Math.max(0, d.dy - 1) + "px")

handleZoom = (e) ->
	e.preventDefault()
	# Check to see if the image is cached
	if @loaded
		window.zoom.zoom this, this.parentNode
	else
		image = document.createElement "img"
		image.onload = =>
			window.zoom.cache[image.src] = image
			@loaded = true
			window.zoom.zoom this, this.parentNode
		image.src = @getAttribute "data-url"

# Caches image
cacheImage = (e) ->
	# Create an image, set its src, you know the rest
	image = document.createElement "img"
	url = @getAttribute "data-url"
	image.onload = =>
		@loaded = true
		window.zoom.cache[url] = image
		@removeEventListener "mouseover", cacheImage, false
	image.src = url
		
init = ->
	if window.location.hash
		window.token = window.location.hash.replace("#","")
		window.location.hash = ""
		window.script = document.createElement "script"
		script.src = 'https://api.instagram.com/v1/users/self/media/recent/?' + window.token + '&callback=window.drawTree'
		document.getElementsByTagName('head')[0].appendChild(script)
	else
		auth = document.getElementsByClassName("auth")[0]
		auth.style.display = "block"
		window.setTimeout ->
			auth.className = "auth loaded"
		, 0
		
window.addEventListener "DOMContentLoaded", init, false