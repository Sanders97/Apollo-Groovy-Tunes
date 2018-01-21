/* Include this tag in the main html file: 
<script src="https://s3.amazonaws.com/stitch-sdks/js/library/v2/stable/stitch.min.js"></script>
*/
const client = new stitch.StitchClient('musicsearch-ojgsa'),
	db = client.service('mongodb', 'mongodb-atlas').db('searchterms');
client.login();

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

// Method to create title-case strings
// added to the String object 
String.prototype.toWordCase = function(){
	return this.split(' ').map((i) => {
		let [o, ...t] = i;
		return o.toUpperCase().concat( t.join('') );
	}).join(' ');
}

// Function to show top terms on page
// When a window loads, get top searches from the database
// and show them within the view 
$(document).ready(()=> getTopN());
function getTopN(n = 5){
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

// Function to execute a search on "top song" click
// Adds a listener to the trending searches to execute
// a query when one is clicked 
$('#search-trends').on('click', 'a', function(){
	$('#music-search-artist').val( $(this).attr('data-artist') );
	$('#music-search-title').val( $(this).attr('data-title') );
	$('#search-btn').trigger('click');
});