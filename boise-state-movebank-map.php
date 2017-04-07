<?php
/*
Plugin Name: Boise State Movebank Map
Description: A custom plugin by Boise State for displaying Movebank animal tracking data
Version: 0.1.0
*/

function bsu_movebank_shortcode() {

	wp_register_script( 'params', plugins_url( '/params.js', __FILE__ ) );
	wp_enqueue_script('params');

	wp_register_script( 'jqueryui', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js' );
	wp_enqueue_script( 'jqueryui' );

	wp_register_script( 'googlemapsapi', 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=visualization,geometry' );
	wp_enqueue_script( 'googlemapsapi' );

	wp_register_script( 'movebank',  plugins_url( '/movebank.js', __FILE__ ) );
	wp_enqueue_script( 'movebank' );

	$str = '<div id="map-canvas" title="time-display" style="width: 600px; height: 700px"></div> <!-- !! can modify to change map dimensions, border etc. -->';
	$str .= '<div id="time-display-div"><input type="text" id="time-display" style="background:transparent; border: none; font-weight: bold; color: #FFFFFF; margin-top: 7px; width: 0px"></input></div>';
	//  $str .= '<style type="text/css">#ui-datepicker-div { background-color: #ffffff; padding: 8px; } .ui-datepicker-prev { position: absolute; left: 0px; padding: 8px; top: 0px; } .ui-datepicker-next { position: absolute; right: 0px; padding: 8px; top: 0px; }</style>';
	$str .= '<style type="text/css">#ui-datepicker-div { background-color: #ffffff; padding: 8px; } .ui-datepicker-next { position: absolute; right: 0px; padding: 8px; top: 0px; }</style>';
	return $str;
}

	add_shortcode('bsu_movebank', 'bsu_movebank_shortcode');
?>
