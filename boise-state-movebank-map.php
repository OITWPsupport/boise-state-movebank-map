<?php
/*
Plugin Name: Boise State Movebank Map
Description: A custom plugin by Boise State for displaying Movebank animal tracking data
Version: 0.0.6
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

	$str = '<div id="map-canvas" style="width: 600px; height: 700px; box-shadow: 0 0 0 0px #fff" title="time-display">
                <div id="time-display-div">
                        <input type="text" id="time-display"
                                style="border: none; font-weight: bold; color: #FFFFFF; background: transparent; margin-top: 7px; width: 0px"></input>
                </div>
</div>';

	return $str;
}

	add_shortcode('bsu_movebank', 'bsu_movebank_shortcode');
?>
