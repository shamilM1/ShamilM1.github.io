import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import voxlens from "voxlens";
import "leaflet/dist/leaflet.css";

const MyMapComponent = ({ geojsonData }) => {
  const geoJsonRef = useRef(null);

  useEffect(() => {
    if (geoJsonRef.current) {
      // Assuming voxlens can be called on SVG elements created by Leaflet
      const mapFeatures = geoJsonRef.current.getLayers(); // Get Leaflet layers

      mapFeatures.forEach((featureLayer) => {
        // Here you would retrieve or generate the corresponding data for this feature
        const featureData = featureLayer.feature.properties;

        // Integrate VoxLens for each feature
        try {
          voxlens("leaflet", featureLayer.getElement(), featureData, {
            title: featureData.name,
            // other options
          });
        } catch (error) {
          console.error("VoxLens integration error:", error);
        }
      });
    }
  }, [geojsonData]); // Run the effect when geojsonData updates

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={geojsonData} ref={geoJsonRef} />
    </MapContainer>
  );
};

export default MyMapComponent;
