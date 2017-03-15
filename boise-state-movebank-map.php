<?php
/*
Plugin Name: Boise State Movebank Map
Description: A custom plugin by Boise State for displaying Movebank animal tracking data
Version: 0.0.4
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

	$str = '<div id="map-canvas" style="width: 600px; height: 700px"></div></div>';

	return $str;
}

	add_shortcode('bsu_movebank', 'bsu_movebank_shortcode');
?>
