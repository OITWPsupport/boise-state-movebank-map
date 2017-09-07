<?php
/*
Plugin Name: Boise State Movebank Map
Plugin URI: https://github.com/OITWPsupport/boise-state-movebank-map/releases
Description: A custom plugin by Boise State for displaying Movebank animal tracking data
Version: 0.1.3
Author URI: https://webguide.boisestate.edu/
*/

function bsu_movebank_shortcode() {

	wp_register_script( 'params', plugins_url( '/params.js', __FILE__ ) );
	wp_enqueue_script('params');

	wp_enqueue_script( 'jquery-ui-datepicker' );
	wp_enqueue_style('e2b-admin-ui-css','http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/themes/base/jquery-ui.css',false,"1.9.0",false);
	// This one is on the advice of http://jafty.com/blog/tag/how-to-use-jquery-ui-in-wordpress/

	wp_register_script( 'googlemapsapi', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAanKKo7ZlWfz9KvGskNG8MrDE8sInt4Cs&libraries=visualization,geometry' );
	wp_enqueue_script( 'googlemapsapi' );

	wp_register_script( 'movebank',  plugins_url( '/movebank.js', __FILE__ ) );
	wp_enqueue_script( 'movebank' );

	$str = '<div id="map-canvas" title="map-display" style="width: 600px; height: 700px"></div> <!-- !! can modify to change map dimensions, border etc. -->';
	$str .= '<div id="datepicker-div" style="position: relative; left: 293px; width: 17px; top: -690px; align: center;""><input type="text" class="datepicker" name="datepicker" value="" id="datepicker-input" style="background:transparent; border: none; font-weight: bold; color: #FFFFFF; margin-top: 7px; width: 0px" /></div>';
	return $str;
}

	add_shortcode('bsu_movebank', 'bsu_movebank_shortcode');
?>
