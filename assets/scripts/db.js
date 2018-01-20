const client = new stitch.StitchClient('musicsearch-ojgsa'),
	db = client.service('mongodb', 'mongodb-atlas').db('searchterms');

client.login();

$('#search-btn').on('click', function(){
	var userSearchName = $('#music-search-artist').val(),
		userSearchTitle = $('#music-search-title').val(),
		documentSearchName = new Record(userSearchName, 'artist', [userSearchTitle], 1),
		documentSearchTitle = new Record(userSearchTitle, 'title', [userSearchName], 1);

	addToMongo(documentSearchName).then(function(){incrementSearch(documentSearchName);});
	addToMongo(documentSearchTitle).then(function(){incrementSearch(documentSearchName);});

	/*
	// Insert Artist Seaarch
	db.collection('searchterms').updateOne(
		{"term": userSearchName, "type": "artist"}, 
		{"$setOnInsert": documentSearchName}, 
		{"upsert": true}
		).then(function(data){
			db.collection('searchterms').updateOne({"term": userSearchName, "type": "artist"}, {"$addToSet": {"relatedto" : userSearchTitle}});
		}).then(fuction(){});
	// Insert Title Search
	db.collection('searchterms').updateOne(
		{"term": userSearchTitle, "type": "title"}, 
		{"$setOnInsert": documentSearchTitle}, 
		{"upsert": true}
		).then(function(data){
			db.collection('searchterms').updateOne({"term": userSearchTitle, "type": "title"}, {"$addToSet": {"relatedto" : userSearchName}});
		});*/
});

function addToMongo(rec){
	db.collection('searchterms').updateOne(
		{"term": rec.term, "type": rec.type}, 
		{"$setOnInsert": rec}, 
		{"upsert": true}
	).then(function(data){
		console.log(data);
		db.collection('searchterms').updateOne(
			{"term": rec.term, "type": rec.type}, 
			// adding to a nested set... we need to add to set 'relatedto' NOT 'relatedto/array'
			{"$addToSet": {"relatedto" : rec.relatedto}}
		);

		//then add to "times" to be += 1
	});
}

function incrementSearch(rec){
	var t = db.collection('searchterms').find(
		{"term": rec.term, "type": rec.type},
		{"times": true}
		) || 0;
	db.collection('searchterms').updateOne(
		{"term": rec.term, "type": rec.type},
		{"$set": {"times": t + 1}}
		);
}

function Record(term, type, relatedto){
	this.term = term;
	this.type = type;
	this.relatedto = relatedto;
}