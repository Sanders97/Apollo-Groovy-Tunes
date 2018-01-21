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

$(document).ready( function(){
	let f = `<p>Or try a top trend from last.fm</p>
			<hr>
			<div id="search-top">
			</div>`;
	$('#search-trends').after(f);
	getLastFM(5);
});
