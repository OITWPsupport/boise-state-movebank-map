	var jsonUrl = "https://www.movebank.org/movebank/service/public/json";
	var study_id = 179241034; // !! add the Movebank ID for your study, available in the Study Details
	var individual_local_identifiers = ['White-backed 32', 'White-backed 36', 'White-backed 39', 'White-backed 40', 'White-backed 43', 'White-backed 90', 'White-headed 88']; // !! add the exact Animal IDs for the animals in the study that you want to show on the map
    var colors = ['#b30000', '#ff9900', '#ffff00', '#80ff80', '#3366ff', '#ffffff', '#9933ff']; // !! specify color codes for the list of Animal IDs above, or use "null" to use default colors
	// month is from 0 to 11:
	timestamp_start = Date.UTC(2016, 04, 01); // !! enable to limit data display to a time range
	timestamp_end = Date.UTC(2018, 02, 28); // !! enable to limit data display to a time range
	// max_events_per_individual was originally set to 1000
	var max_events_per_individual = 1000; // !! change as you like to show more/fewer locations per individual; note that more locations will slow the time it takes the page to load