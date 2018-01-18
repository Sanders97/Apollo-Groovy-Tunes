/*
Function to get AJAX results for a video
Parameters: name a user searched on and title a user searched on
*/
function getVideo(searchName, searchTitle ){

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
	$('.main-content').empty();

	// getVideo(userSearchName, userSearchTitle).then(function(data){
	//	addCard(data.heading ... etc );
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