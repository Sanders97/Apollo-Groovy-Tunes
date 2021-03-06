//variable used to create unique ul element for for cards
var cardCount = 0;


/*
Event Listeners
// If a search title or artist is entered or missing value attempted 
// to be entered, hide errors 
// If user attempts to search, validate that artist AND title have been entered
// if so, get lyrics and video
// if not, show errors  
*/
$('#music-search-title').on('focus', function () {
	$('.title-error').remove();
});

$('#music-search-artist').on('focus', function () {
	$('.artist-error').remove();
});

$('#search-btn').on('click', function (e) {
	e.preventDefault();

	let userArtistSearch = $('#music-search-artist').val().trim(),
		userTitleSearch = $('#music-search-title').val().trim();

	if (userArtistSearch && userTitleSearch) {
		$('.error').remove();
		getVideo(userArtistSearch, userTitleSearch);
		getLyrics(userArtistSearch, userTitleSearch);

		$('#music-search-title, #music-search-artist').val('');

	} else {
		if (!userTitleSearch) {
			$('#music-search-title').after('<p class="error title-error">* Title is required</p>');
		}
		if (!userArtistSearch) {
			$('#music-search-artist').after('<p class="error title-error">* Artist is required</p>');
		}
	}

});

/*
Get Video Function
// When called, gets youtube video results and adds them to a card
// adds card to the ui 
*/
function getVideo(userSearchName, searchTitle) {
	var q = userSearchName + " " + searchTitle + " karaoke";

	addVideoCard(searchTitle);

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search", {
			part: 'snippet, id',
			q: q,
			type: 'video',
			maxResults: 4,
			videoSyndicated: true,
			videoEmbeddable: true,
			videoLicense: 'creativeCommon',
			key: 'AIzaSyBEw_OnLrWKAKGIzxb2ee5WtfnRR0md67Q'
		},
		function (data) {

			// Log Data
			console.log(data);

			$.each(data.items, function (i, item) {
				// Get Output
				var output = getOutput(item);
				//set the new videos to the correct card
				//by referencing the card Id created for the card
				$('#c-' + cardCount + ' .col-rhs ul').append(output);
				$('.card-videos').sortable({ handle: '.video-title', placeholder: 'drop-zone' });
				$('.card-videos').disableSelection();
			});
		}
	);
}

/*
Built Output Function
// When called, creates a list item DOM element 
// with classes to create a video content item  
*/
function getOutput(item) {
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var channelTitle = item.snippet.channelTitle;
	var videoDate = item.snippet.publishedAt;

	// Build Output String
	var output = '<li>' +
		'<div>' +
		'<iframe width="360" height="200" src="https://www.youtube.com/embed/' + videoId + '?rel=0" frameborder="0"; encrypted-media" allowfullscreen></iframe>' +
		'</div>' +
		'<div>' +
		'<small class="video-title">By <span>' + channelTitle + '</span> on ' + videoDate + '</small>' +
		'</div>' +
		'</li>';

	return output;
}

/*
Function to get AJAX results for lyrics
Parameters: name a user searched on and song title a user searched on
*/
function getLyrics(searchName, searchTitle) {
	$.ajax({
		type: "GET",
		data: {
			apikey: "cf26b189ccd280c650cdcbc166f3c71d",
			q_track: searchName,//"back to december",
			q_artist: searchTitle,//"taylor%20swift",
			f_has_lyrics: 1,
			format: "jsonp",
			callback: "jsonp_callback"
		},
		url: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
		dataType: "jsonp",
		jsonpCallback: 'jsonp_callback',
		contentType: 'application/json',
		success: function (data) {
			console.log(data);
			var lyricsTitle = searchTitle + " Lyrics";
			var lyrics = (data.message.body.lyrics.lyrics_body).replace('******* This Lyrics is NOT for Commercial use *******', '').replace('(1409617446111)', '').replace(/\n/gm, '<br>');
			$('#c-' + cardCount + ' .col-lhs').append('<h4>' + lyricsTitle + '</h4>');
			$('#c-' + cardCount + ' .col-lhs').append('<p>' + lyrics + '</p>');
			getAlbum(searchName, searchTitle);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

function getAlbum(searchName, searchTitle) {

	let key = 'c0c82d5d1180077971d1302e8e72147d';

	$.ajax(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${key}&artist=${searchName}&track=${searchTitle}&format=json`)

		.then(function (data) {
			console.log('album', data.track.album);
			var albumCover = (data.track.album.image[3]["#text"]);
			$('#c-' + cardCount + ' .col-lhs h4').after('<div class="cover-art"><img src="' + albumCover + '"></div>');
		});
}


/*
Add Video Card Function
// Creates a card DOM element 
// and appends it to the main content section 
*/

function addVideoCard(cardHeading) {

	//We need an id for the ul so we can add the list items
	//for videos and lyrics to the correct card body
	cardCount++;

	var v = '<div class="card" id="c-' + cardCount + '">';
	v += '<div class="card-header">' + cardHeading + '</div>';
	v += '<div class="card-body">';
	v += '<div class="row">';
	v += '<div class="col col-lhs"></div>';
	v += '<div class="col col-rhs">';
	v += '<ul class="card-videos" id="card' + cardCount + '"></ul>'
	v += '</div>';
	v += '</div></div><!--card-body--></div><!--card-header-->';

	$('.main-content').prepend(v);

}