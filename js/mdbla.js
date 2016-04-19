/*

	Default parameters

*/
var mdbla = {};
mdbla.dualmap = false;
mdbla.map1;
mdbla.map2;
mdbla.year1 = 1990;
mdbla.year2 = 1990;
mdbla.cost = "https://mdbucla.cartodb.com/api/v2/viz/b8cc8e6e-05c2-11e6-8ee8-0e3ff518bd15/viz.json";


/*

	Map Layers

*/
var baselayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
var baselayer2 = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
var labellayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
var labellayer2 = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

/*

	On document load

*/
$( document ).ready(function() {
	mdbla.init();

	// clone the dropdown and add to second map
	// change the id's and classes accordingly
	// $('#mdbla-dropdown').clone().attr('id','mdbla-dropdown2').appendTo('#dropdown-container').find('ul').toggleClass('menu1 menu2');
	// $('#mdbla-dropdown2').hide();

	// assign actions to drop down selections
	// $(".menu1 li a").click(function(){
	// 	var selText = $(this).text();
	// 	var param = $(this).attr('title');
	// 	$(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
	// 	$('.year').removeClass('btn-info');
	// 	mdbla.addLayer(param,mdbla.map1);
	// });

	// $(".menu2 li a").click(function(){
	// 	var selText = $(this).text();
	// 	var param = $(this).attr('title');
	// 	$(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
	// 	mdbla.addLayer(param,mdbla.map2);
	// });

	mdbla.addLayer('cost',mdbla.map1);

});

$( window ).resize(function() {
	mdbla.resize();
});

mdbla.resize = function()
{
	$('#map1').css('height',$(window).height()-50);
	$('.container').css('width','100%');	
}

/*

	Begin mapping

*/
mdbla.init = function()
{	
	// adjust map window height
	mdbla.resize();

	// set map options
	var mapOptions = {
		center: [33.98037811701901,-118.23280334472658],
		zoom: 10
	};
	mdbla.map1 = new L.Map('map1', mapOptions);
	// mdbla.map2 = new L.Map('map2', mapOptions);

	mdbla.map1.addLayer(baselayer);
	// mdbla.map2.addLayer(baselayer2);
	// mdbla.map1.sync(mdbla.map2);
	// mdbla.map2.sync(mdbla.map1);

	// // sync maps on pan
	// mdbla.map1.on('mousedown', function(e) {
	// 	mdbla.map1.sync(mdbla.map2);
	// 	mdbla.map2.sync(mdbla.map1);
	// });
	// mdbla.map2.on('mousedown', function(e) {
	// 	mdbla.map1.sync(mdbla.map2);
	// 	mdbla.map2.sync(mdbla.map1);
	// });

}

mdbla.addLayer = function(param,map2use)
{
	// hide existing layer
	if(map2use == mdbla.map1)
	{
		if(mdbla.layer1) mdbla.layer1.hide();
		// remove labels
		map2use.removeLayer(labellayer)
		// remove old legend
		$('#map1').find('.cartodb-legend-stack').hide();

	}
	else
	{
		if(mdbla.layer2) mdbla.layer2.hide();
		// remove labels
		map2use.removeLayer(labellayer2)
		// remove old legend
		$('#map2').find('.cartodb-legend-stack').hide();

	}
	
	// get rid of any open tooltip windows and legends
	$('.cartodb-tooltip').hide();


	// defaults
	if(param !== undefined)
	{
		mdbla.param = param;
	}

	// jsonlayer to add
	
	var jsonURL = mdbla[mdbla.param];

	// add layer
	cartodb.createLayer(map2use, jsonURL,{tooltip:false})
		.addTo(map2use)
		.on('done', function(layer) {
			layer
			.on('load',function(){
				// hide existing layer
				if(map2use == mdbla.map1)
				{
					mdbla.layer1 = layer;
					map2use.addLayer(labellayer)
				}
				else
				{
					mdbla.layer2 = layer;
					map2use.addLayer(labellayer2)
				}


			})
			.on('featureOver', function(e, latlng, pos, data) {
				var cost = Math.round(data.cost);
				cost = cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var incarcerated_persons = data.count_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				$('#info-panel').html('<div><span class="info-cost">$'+cost+'</span><br><span class="info">Total cost</span></div>');
				$('#info-panel').append('<div><span class="info-big">'+incarcerated_persons+'</span><br><span class="info">Number of incarcerated persons</span></div>');

				
			})
			.on('error', function(err) {
				console.log('error: ' + err);
			});
			// var sublayer = layer.getSubLayer(0);

		}).on('error', function(err) {
		console.log("some error occurred: " + err);
	});
}

mdbla.addMetro = function()
{
	// add layer
	cartodb.createLayer(mdbla.map1, 'https://mdblaucla.cartodb.com/api/v2/viz/7b22ac78-0596-11e6-b89d-0e31c9be1b51/viz.json',{tooltip:true})
		.addTo(mdbla.map1);

}

mdbla.toggleDualMap = function()
{
	// resync maps because buggy if you don't
	mdbla.map1.sync(mdbla.map2);
	mdbla.map2.sync(mdbla.map1);

	if(mdbla.dualmap)
	{
		$('#map2').hide(); 
		$('#mdbla-dropdown2').hide();
		$('#map1').css('width','100%'); 
		$('#map1').css('border-right','0px solid black');
		$('#map2').css('border-left','0px solid black');
		mdbla.map1.invalidateSize();
		mdbla.dualmap = false;
	}
	else
	{
		$('#map2').show();
		$('#mdbla-dropdown2').show();
		// $('#map1').animate({ width: "50%" }, 1000 )
		$('#map1').css('width','50%'); 
		$('#map1').css('border-right','2px solid black');
		$('#map2').css('border-left','2px solid black');
		mdbla.map1.invalidateSize();		
		mdbla.map2.invalidateSize();		
		mdbla.dualmap = true;

	}
}

