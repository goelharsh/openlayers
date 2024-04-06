import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';

const OpenLayersMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const source = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // Create a vector layer to render the pinpoint
    const pinpointSource = new VectorSource();
    const pinpointLayer = new VectorLayer({
      source: pinpointSource,
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: 'red' }),
          stroke: new Stroke({
            color: 'white',
            width: 2,
          }),
        }),
      }),
    });
    map.addLayer(pinpointLayer);

    // Event listener for map click to add a pinpoint
    map.on('click', (event) => {
      const coordinates = event.coordinate;
      const point = new Point(coordinates);
      const feature = new Feature(point);
      pinpointSource.clear(); // Clear previous pinpoint
      pinpointSource.addFeature(feature);
    });

    // Create drawing interactions
    const drawPoint = new Draw({
      source: source,
      type: 'Point',
    });

    const drawLine = new Draw({
      source: source,
      type: 'LineString',
    });

    const drawPolygon = new Draw({
      source: source,
      type: 'Polygon',
    });

    // Create modify and snap interactions
    const modify = new Modify({ source: source });
    const snap = new Snap({ source: source });

    // Add interactions to the map
    map.addInteraction(drawPoint);
    map.addInteraction(drawLine);
    map.addInteraction(drawPolygon);
    map.addInteraction(modify);
    map.addInteraction(snap);

    return () => {
      map.setTarget(null);
    };
  }, []);

  return <div ref={mapRef} className="map" style={{ width: '100%', height: '600px' }} />;
};

export default OpenLayersMap;
