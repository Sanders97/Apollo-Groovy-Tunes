// Initialize Firebase
var config = {
  apiKey: "AIzaSyC7GvTxM-Pr57evypfZkONFOusmfLmAP2s",
  authDomain: "musicsear-b00a0.firebaseapp.com",
  databaseURL: "https://musicsear-b00a0.firebaseio.com",
  projectId: "musicsear-b00a0",
  storageBucket: "musicsear-b00a0.appspot.com",
  messagingSenderId: "749018516467"
};
firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function(){
  database.ref().orderBy.once('value', function(data){
    data = data.val();
  });
});

$('#search-btn').on('click', function(){
  var q = new UserQuery(
    $('#music-search-artist').val(), 
    $('#music-search-title').val()
  );

  function UserQuery(artist, title, count){
    this.artist = artist;
    this.title = title;
    this.count = count || 0;
    this.artistPath = 'artist/' + this.artist;
    this.artistTitlePath = this.artistPath + '/titles/' + this.title;
    this.titePath = 'title/' + this.title;
    this.titleArtistPath = this.titePath + '/artists/' + this.artists;
  }

  // Update Firebase
  // If a count of previous artist/title searches exists, pull that in
  // Upsert the artist and title in db 
  // Upsert the artist > titles and title > artists in db
  database.ref( q.artistTitlePath ).once('value', function(data){
    q.count =  data.val() ? data.val().titles[q.title] + 1 : 1;
  }).then(function(){
    database.ref().update({
      [q.titePath]: q.title,
      [q.artistPath]: q.artist
    });
  }).then(function(){
    database.ref().update({
      [q.titleArtistPath]: q.artist,
      [q.artistTitlePath]: q.title
    });
  });

});
