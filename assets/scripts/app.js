/*
Function to get AJAX results for a video
Parameters: name a user searched on and title a user searched on
*/
//variable used to create unique ul element for for cards
var cardCount = 0;

$("#search-btn").click(function(e){
	e.preventDefault();
	executeSearch();
});

function getVideo(userSearchName, searchTitle){
	
		var q = userSearchName + " " + searchTitle + " Lyrics";

		addVideoCard(searchTitle); 
		
		// Run GET Request on API
		$.get(
			"https://www.googleapis.com/youtube/v3/search",{
				part: 'snippet, id',
				q: q,
				type:'video',
				maxResults: 3,
				videoSyndicated: true,
				videoEmbeddable: true,
				videoLicense: 'creativeCommon',
				key: 'AIzaSyBEw_OnLrWKAKGIzxb2ee5WtfnRR0md67Q'},
				function(data){
					
					// Log Data
					console.log(data);
					
					$.each(data.items, function(i, item){
						// Get Output
						var output = getOutput(item);
						//set the new videos to the correct card
						//by referencing the card Id created for the card
						$('#card' + cardCount).append(output);
					});
				}
		);
}

// Build Output
function getOutput(item){
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
	'<small>By <span>'+channelTitle+'</span> on '+videoDate+'</small>' +
	'</div>' +
	'</li>' +
	'<div></div>' +
	'';
	
	return output;
}

/*
Function to get AJAX results for lyrics
Parameters: name a user searched on and song title a user searched on
*/
function getLyrics(searchName, searchTitle ){

}

/*
Function to get AJAX results for embedable widget 
Parameters: name a user searched on and song title a user searched on
*/
function getWidget(searchName, searchTitle ){

}


/*
Function to react to user click
// Checks that input exists 
// Clears existing page body and clears input fields
// Calls functions to execute ajax calls (which will append cards as promise results)
// Adds search criteria to user's past search and to db for trending searches 
*/

function executeSearch(){
	var userSearchName = $('#music-search-artist').val(),
		userSearchTitle = $('#music-search-title').val();
	
	if( !userSearchName || !userSearchTitle ){
		return ; // do not do anything if a field is blank
	}
	//$('.main-content').empty();
	getVideo(userSearchName,userSearchTitle);
	
	//getVideo(userSearchName, userSearchTitle).then(function(data){
	//	addCard();
	//});
	// getLyrics(userSearchName, userSearchTitle).then(function(data){
	//	addCard(data.heading ... etc );
	//});
	// getWidget(userSearchName, userSearchTitle).then(function(data){
	//	addCard(data.heading ... etc );
	//});
	// etc... as we add more for tickets/events

	$('#music-search-title, #music-search-artist').val('');
}


/*
Function to add a new card 
Parameters: card heading, body content (html), link text and link source
*/

function addCard(cardHeading, cardContents, cardButtonText, cardLinkTo){
	var v = '<div class="card">';
	v += '<div class="card-header">Results: ' + cardHeading + '</div>';
	v += '<div class="card-body">' + cardContents + '</div>';
	v += '<a href="'+ cardLinkTo +'" target="_blank" class="btn btn-info">' + cardButtonText + '</a>';
	v += '</div>';

	$('.main-content').append(v);
}

function addVideoCard(cardHeading){

	//We need an id for the ul so we can add the list items
	//for videos and lyrics to the correct card body
	cardCount++;

	var v = '<div class="card">';
	v += '<div class="card-header">Results: ' + cardHeading + '</div>';
	v += '<div class="card-body">'
	v += '<ul id="card' + cardCount + '">'
	v += '</div>';
	v += '</div>';

	$('.main-content').append(v);
	
}