	var jsonUrl = "https://www.movebank.org/movebank/service/public/json";
	var study_id = 179241034; // !! add the Movebank ID for your study, available in the Study Details
	var individual_local_identifiers = ['Wakathutangosa -- White-backed 90', 'Tumaine -- White-headed 88', 'Pukuta -- White-backed 39', 'Cosenua -- White-backed 40', 'KFC -- White-backed 36', 'Sanguza -- White-backed 32', 'Zelador -- White-backed 43' ]; // !! add the exact Animal IDs for the animals in the study that you want to show on the map
	var colors = ['#0000ff', '#ffffff', '#ff00ff', '#f9461c', '#00ff00', '#ff0000', '#ffffcc']; // !! specify color codes for the list of Animal IDs above, or use "null" to use default colors

	// month is from 0 to 11:
	timestamp_start = Date.UTC(2016, 04, 01); // !! enable to limit data display to a time range
	timestamp_end = Date.UTC(2017, 11, 31); // !! enable to limit data display to a time range
	// max_events_per_individual was originally set to 1000
	var max_events_per_individual = 1000; // !! change as you like to show more/fewer locations per individual; note that more locations will slow the time it takes the page to load