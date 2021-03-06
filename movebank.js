            var data;

            google.maps.event.addDomListener(window, 'load', initialize);

            function initialize() {
                map = new google.maps.Map(document.getElementById('map-canvas'), {
                    mapTypeId: google.maps.MapTypeId.SATELLITE // !! can change to change the default Google map background
                });

                movebankLogo = document.createElement('div');
                movebankLogo.innerHTML = '<a href="https://www.movebank.org"><img src="http://strd.de/logo_movebank_gmap6.png" alt="movebank.org logo" height=23px style="box-shadow: 0 0 0 0px #fff" /></a>';
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(movebankLogo);

                timeDisplay = document.getElementById("datepicker-input");
                map.controls[google.maps.ControlPosition.TOP_CENTER].push(timeDisplay);

                jQuery.getJSON(jsonUrl + "?callback=?", {
                    study_id: study_id,
                    individual_local_identifiers: individual_local_identifiers,
                    max_events_per_individual : max_events_per_individual,
                    timestamp_start: timestamp_start, // !! enable to limit data display to a time range
                    timestamp_end: timestamp_end, // !! enable to limit data display to a time range
                    sensor_type: "gps" // !! change if needed to specify the sensor type to display; options are gps, argos-doppler-shift, solar-geolocator, radio-transmitter, bird-ring, natural-mark
                }, function (data0) {
                    data = data0;
                    for (i = 0; i < data.individuals.length; i++) {
                        data.individuals[i].color = colors[i];
                    }
                    setBounds();
                    createMarkers();
                    createPolylines();

                    startDate = null;
                    endDate = null;
                    for (i = 0; i < data.individuals.length; i++) {
                        for (j = 0; j < data.individuals[i].locations.length; j++) {
                            ts = data.individuals[i].locations[j].timestamp;
                            if (startDate != null) {
                                startDate = Math.min(startDate, ts);
                                endDate = Math.max(endDate, ts);
                            } else {
                                startDate = ts;
                                endDate = ts;
                            }
                        }
                    }
                    jQuery(function () {
                    	maxDate = new Date(endDate);
                    	maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 1);

                        jQuery('#datepicker-input').datepicker({
                            showOn: "button",
                            buttonImageOnly: true,
                            buttonImage: "https://www.google.com/help/hc/images/sites_icon_calendar_small.gif",
                            showButtonPanel: false,
                            minDate: new Date(startDate),
                            maxDate: maxDate,
                            dateFormat: 'yy-mm-dd',
                            onSelect: function (dateText) {
                                date = jQuery(this).datepicker('getDate');
                                t = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000).getTime();
                                for (i = 0; i < data.individuals.length; i++)
                                    showClosestPointInTime(data.individuals[i], t);
                              	jQuery(this).data('datepicker').inline = true;                                      
                            },
                        	onClose: function() {
                            	jQuery(this).data('datepicker').inline = false;
                        	}                        
                        });
                        jQuery('#datepicker-input').datepicker('setDate', new Date(endDate));

                    });
                    for (i = 0; i < data.individuals.length; i++)
                        showClosestPointInTime(data.individuals[i], endDate);
                    document.getElementById('datepicker-input').readOnly = true;
                    document.getElementById('datepicker-input').style.width = 75;
                });

                function setBounds() {
                    var bounds = new google.maps.LatLngBounds();
                    for (i = 0; i < data.individuals.length; i++) {
                        for (j = 0; j < data.individuals[i].locations.length; j++) {
                            bounds.extend(new google.maps.LatLng(
                                data.individuals[i].locations[j].location_lat,
                                data.individuals[i].locations[j].location_long));
                        }
                    }
                    map.fitBounds(bounds);
                }

                function showClosestPointInSpace(individual, latLng, snapToPoint) {
                    var distCurr = 1000 * 1000 * 1000 * 1000;
                    var indexCurr;
                    for (j = 0; j < individual.locations.length; j++) {
                        latLng0 = new google.maps.LatLng(
                            individual.locations[j].location_lat,
                            individual.locations[j].location_long);
                        dist0 = google.maps.geometry.spherical.computeDistanceBetween(
                            latLng, latLng0);
                        if (dist0 < distCurr) {
                            indexCurr = j;
                            distCurr = dist0;
                        }
                    }
                    if (indexCurr == 0)
                        indexStart = 1;
                    else
                        indexStart = indexCurr - 1;
                    if (indexCurr == individual.locations.length - 1)
                        indexEnd = individual.locations.length - 2;
                    else
                        indexEnd = indexCurr + 1;
                    indexClosest = indexCurr;
                    distCurr = 1000 * 1000 * 1000 * 1000;
                    for (j = indexStart; j <= indexEnd; j += 2) {
                        latLng0 = new google.maps.LatLng(
                            individual.locations[j].location_lat,
                            individual.locations[j].location_long);
                        dist0 = google.maps.geometry.spherical.computeDistanceBetween(
                            latLng, latLng0);
                        if (dist0 < distCurr) {
                            indexCurr = j;
                            distCurr = dist0;
                        }
                    }
                    indexSecondClosest = indexCurr;
                    if (snapToPoint)
                        indexSecondClosest = indexClosest;
                    pointOnLine = getPointClosestToLine(
                        individual.locations[indexClosest].location_long,
                        individual.locations[indexClosest].location_lat,
                        individual.locations[indexSecondClosest].location_long,
                        individual.locations[indexSecondClosest].location_lat,
                        latLng.lng(), latLng.lat());
                    individual.marker.setPosition(new google.maps.LatLng(pointOnLine.y,
                        pointOnLine.x));
                    if (individual.marker.getMap() == null)
                        individual.marker.setMap(map);
                    latLngClosest = new google.maps.LatLng(
                        individual.locations[indexClosest].location_lat,
                        individual.locations[indexClosest].location_long);
                    distClosest = google.maps.geometry.spherical
                        .computeDistanceBetween(latLng, latLngClosest);
                    latLngSecondClosest = new google.maps.LatLng(
                        individual.locations[indexSecondClosest].location_lat,
                        individual.locations[indexSecondClosest].location_long);
                    distSecondClosest = google.maps.geometry.spherical
                        .computeDistanceBetween(latLng, latLngSecondClosest);
                    t = (individual.locations[indexClosest].timestamp * distSecondClosest + individual.locations[indexSecondClosest].timestamp * distClosest) / (distClosest + distSecondClosest);
                    individual.marker.timestamp = t;
                    for (i = 0; i < data.individuals.length; i++)
                        if (data.individuals[i] != individual)
                            showClosestPointInTime(data.individuals[i], t);
	                    jQuery('#datepicker-input').datepicker('setDate', new Date(t));
                }

                function getPointClosestToLine(x1, y1, x2, y2, x3, y3) {
                    dx = x2 - x1;
                    dy = y2 - y1;
                    if ((dx == 0) && (dy == 0)) {
                        x0 = x1;
                        y0 = y1;
                    } else {
                        t = ((x3 - x1) * dx + (y3 - y1) * dy) / (dx * dx + dy * dy);
                        t = Math.min(Math.max(0, t), 1);
                        x0 = x1 + t * dx;
                        y0 = y1 + t * dy;
                    }
                    return {
                        x: x0,
                        y: y0
                    };
                }

                function formatTimestamp(timestamp) {
                    var date = new Date(timestamp);
                    var ss = date.getSeconds();
                    var mi = date.getMinutes();
                    var hh = date.getHours();
                    var dd = date.getDate();
                    var mm = date.getMonth() + 1;
                    var yyyy = date.getFullYear();
                    if (ss < 10) {
                        ss = '0' + ss;
                    }
                    if (mi < 10) {
                        mi = '0' + mi;
                    }
                    if (hh < 10) {
                        hh = '0' + hh;
                    }
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss;
                }

                function formatDate(timestamp) {
                    var date = new Date(timestamp);
                    var dd = date.getDate();
                    var mm = date.getMonth() + 1;
                    var yyyy = date.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    return yyyy + "-" + mm + "-" + dd;
                }

                function showClosestPointInTime(individual, t) {
                    var distCurr = 1000 * 1000 * 1000 * 1000;
                    var indexCurr;
                    for (j = 0; j < individual.locations.length; j++) {
                        dist0 = Math.abs(t - individual.locations[j].timestamp);
                        if (dist0 < distCurr) {
                            indexCurr = j;
                            distCurr = dist0;
                        }
                    }
                    if (indexCurr == 0)
                        indexStart = 1;
                    else
                        indexStart = indexCurr - 1;
                    if (indexCurr == individual.locations.length - 1)
                        indexEnd = individual.locations.length - 2;
                    else
                        indexEnd = indexCurr + 1;
                    indexClosest = indexCurr;
                    distClosest = distCurr;
                    distCurr = 1000 * 1000 * 1000;
                    for (j = indexStart; j <= indexEnd; j += 2) {
                        dist0 = Math.abs(t - individual.locations[j].timestamp);
                        if (dist0 < distCurr) {
                            indexCurr = j;
                            distCurr = dist0;
                        }
                    }
                    indexSecondClosest = indexCurr;
                    distSecondClosest = distCurr;
                    x0 = individual.locations[indexClosest].location_long;
                    y0 = individual.locations[indexClosest].location_lat;
                    x1 = individual.locations[indexSecondClosest].location_long;
                    y1 = individual.locations[indexSecondClosest].location_lat;
                    x = (x0 * distSecondClosest + x1 * distClosest) / (distClosest + distSecondClosest);
                    y = (y0 * distSecondClosest + y1 * distClosest) / (distClosest + distSecondClosest);
                    individual.marker.setPosition(new google.maps.LatLng(y, x));
                    individual.marker.timestamp = t;
                    if (individual.marker.getMap() == null)
                        individual.marker.setMap(map);
                    gracePeriod = 1000 * 60 * 60 * 24 * 2;
                    if (t + gracePeriod < individual.locations[0].timestamp || t - gracePeriod > individual.locations[individual.locations.length - 1].timestamp)
                        individual.marker.setMap(null);
                }

                function createMarkers() {
                    for (i = 0; i < data.individuals.length; i++) {
                        data.individuals[i].marker = new google.maps.Marker({
                            clickable: true,
                            draggable: true,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                fillOpacity: 1.0,
                                fillColor: data.individuals[i].color,
                                strokeWeight: 0,
                                scale: 5
                            },
                            optimized: true
                        });
                        data.individuals[i].marker.setPosition(new google.maps.LatLng());
                        data.individuals[i].marker.setTitle(data.individuals[i].individual_local_identifier);
                        google.maps.event.addListener(data.individuals[i].marker, "click", (function (individual) {
                            return function () {
                                showInfo(individual);
                            };
                        })(data.individuals[i]));
                        google.maps.event.addListener(data.individuals[i].marker,
                            'drag', (function (individual) {
                            return function (e) {
                                hideInfos();
                                showClosestPointInSpace(individual, e.latLng,
                                    false);
                            };
                        })(data.individuals[i]));
                    }
                }

                function showInfo(individual) {
                    wasOpen = (individual.info != null);
                    hideInfos();
                    if (!wasOpen && individual.marker) {
                        individual.info = new google.maps.InfoWindow();
                        updateInfo(individual);
                        individual.info.open(map, individual.marker);
                    }
                }

                function hideInfos() {
                    for (i = 0; i < data.individuals.length; i++) {
                        if (data.individuals[i].info) {
                            data.individuals[i].info.close();
                            data.individuals[i].info = null;
                        }
                    }
                }

                function updateInfo(individual) {
                    if (individual.info && individual.marker) {
                        tsFirst = individual.locations[0].timestamp;
                        tsLast = individual.locations[individual.locations.length - 1].timestamp;
                        ts = individual.marker.timestamp;
                        if (ts < tsFirst)
                            ts = tsFirst;
                        if (ts > tsLast)
                            ts = tsLast;
                        individual.info.setContent("<b>" + individual.individual_local_identifier + "</b>" + "<br>" +
                            "Recorded at " + formatTimestamp(ts));
                    }
                }

                function createPolylines() {
                    for (i = 0; i < data.individuals.length; i++) {
                        var track = [];
                        for (j = 0; j < data.individuals[i].locations.length; j++) {
                            track[j] = new google.maps.LatLng(
                                data.individuals[i].locations[j].location_lat,
                                data.individuals[i].locations[j].location_long);
                        }
                        icons = [{
                                icon: {
                                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                                },
                                offset: 0,
                                repeat: '100px'
                            }
                        ];
                        var polyline = new google.maps.Polyline({
                            path: track,
                            clickable: true,
                            strokeColor: data.individuals[i].color,
                            strokeOpacity: 0.7,
                            strokeWeight: 2
                            //icons : icons
                        });
                        polyline.setMap(map);
                        google.maps.event.addListener(polyline, 'click', (function (
                            individual) {
                            return function (e) {
                                showClosestPointInSpace(individual, e.latLng, true);
                                showInfo(individual);
                            };
                        })(data.individuals[i]));
                    }
                }
            }

