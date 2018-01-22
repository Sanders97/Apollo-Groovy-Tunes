/* Include this tag in the main html file: 
<script src="https://s3.amazonaws.com/stitch-sdks/js/library/v2/stable/stitch.min.js"></script>
*/
const client = new stitch.StitchClient('musicsearch-ojgsa'),
	db = client.service('mongodb', 'mongodb-atlas').db('searchterms');
client.login();


// Method to create title-case strings
// added to the String object 
String.prototype.toWordCase = function(){
	return this.split(' ').map((i) => {
		let [o, ...t] = i;
		return o.toUpperCase().concat( t.join('') );
	}).join(' ');
}

// Function to get top 5 songs from last.fm api
// Makes ajax request and appends results to UI
function getLastFM(n = 5) {
	let key = 'c0c82d5d1180077971d1302e8e72147d', 
		sec = 'f214b67fba06a7a084b83313ffe20217';

	$.ajax(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${key}&limit=${n}&format=json`)
	.then(function(data){

		let t = $('<ol>');
		for(let i of data.tracks.track){
			i.frag = '<li><a href="#" data-title="' + i.name +'" data-artist="' + i.artist.name + '">';
				i.frag += '<span>'+ i.name.toWordCase() + '</span> by <span>' + i.artist.name.toWordCase() + '</span></a></li>';
				t.append(i.frag);
			}

		$('#search-top').html(t);
	});
}


// Function to show top terms on page
// Appends top searches from database to UI
function getTopN(n = 5){
	client.login();
	db.collection('searchterms').find({}).sort({"count": -1}).limit(n).execute()
	.then(function(data){
		let t = $('<ol>');
			for(let i of data){
				i.frag = '<li><a href="#" data-title="' + i.title +'" data-artist="' + i.artist + '">';
				i.frag += '<span>'+ i.title.toWordCase() + '</span> by <span>' + i.artist.toWordCase() + '</span></a></li>';
				t.append(i.frag);
			}

		$('#search-trends').html(t);
	});
}


// Function to show top songs 
// When window loads
$(document).ready(function(){
	// $('.main-content').sortable({handle: '.card-header', placeholder: 'drop-zone' });
	
	getTopN();

	let f = `<p>Or try a top trend from last.fm</p>
		<hr>
		<div id="search-top">
		</div>`;
	$('#search-trends').after(f);

	getLastFM(5);

	// Function to execute a search on "top song" click
	// Adds a listener to the trending searches to execute
	// a query when one is clicked 
	$('#search-trends, #search-top').on('click', 'a', function(){
		$('#music-search-artist').val( $(this).attr('data-artist') );
		$('#music-search-title').val( $(this).attr('data-title') );
		$('#search-btn').trigger('click');
	});
});

// Function to store query to database
// When a user conducts a search, the artist and title
// are stored to the db and the query count is incremented 
$('#search-btn').on('click', function(){
	let userSearchArtist = $('#music-search-artist').val().trim().toLowerCase(),
		userSearchTitle = $('#music-search-title').val().trim().toLowerCase();

	db.collection('searchterms').updateOne(
		{"title": userSearchTitle, "artist": userSearchArtist}, 
		{"$inc": {"count": 1}, "$set": {"latest": new Date().toISOString()}}, 
		{"upsert": true}
	);
});