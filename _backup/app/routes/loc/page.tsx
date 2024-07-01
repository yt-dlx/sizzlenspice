// // app/page.tsx
// "use client";
// import Leaflet from "leaflet";
// import "leaflet/dist/leaflet.css";
// import React, { useState, useEffect } from "react";
// import "leaflet-control-geocoder/dist/Control.Geocoder.js";
// import "leaflet-control-geocoder/dist/Control.Geocoder.css";
// import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";

// Leaflet.Icon.Default.mergeOptions({
// iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
// shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
// });

// declare module "leaflet" {
// namespace Control {
// class Geocoder {
// static nominatim(): any;
// }
// }
// }

// const HomePage = () => {
// const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
// const [clickLocation, setClickLocation] = useState<{ latitude: number; longitude: number } | null>(null);
// const [distance, setDistance] = useState<number | null>(null);

// useEffect(() => {
// if (navigator.geolocation) {
// navigator.geolocation.getCurrentPosition(
// (position) => {
// setLocation({
// latitude: position.coords.latitude,
// longitude: position.coords.longitude,
// });
// },
// (error) => console.error("Error getting location:", error)
// );
// } else console.error("Geolocation is not supported by this browser.");
// }, []);

// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
// const toRad = (value: number) => (value * Math.PI) / 180;
// const R = 6378;
// const dLat = toRad(lat2 - lat1);
// const dLon = toRad(lon2 - lon1);
// const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
// const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// return R * c;
// };

// useEffect(() => {
// if (location && clickLocation) {
// const dist = calculateDistance(location.latitude, location.longitude, clickLocation.latitude, clickLocation.longitude);
// setDistance(dist);
// }
// }, [location, clickLocation]);

// const LocationMarker = () => {
// const map = useMap();
// map.on("click", (e) => {
// setClickLocation({
// latitude: e.latlng.lat,
// longitude: e.latlng.lng,
// });
// });

// return clickLocation ? (
// <Marker position={[clickLocation.latitude, clickLocation.longitude]}>
// <Popup>
// Latitude: {clickLocation.latitude}, Longitude: {clickLocation.longitude}
// </Popup>
// </Marker>
// ) : null;
// };

// const RestrictMapView = () => {
// const map = useMap();
// useEffect(() => {
// if (location) {
// const bounds = Leaflet.latLng(location.latitude, location.longitude).toBounds(6000);
// map.setMaxBounds(bounds);
// map.fitBounds(bounds);
// map.setZoom(13);
// map.options.maxZoom = 15;
// map.options.minZoom = 13;
// map.options.zoomSnap = 0.5;
// map.options.dragging = false;
// map.on("drag", function () {
// map.panInsideBounds(bounds, { animate: false });
// });
// }
// }, [location, map]);
// return null;
// };

// return (
// <div className="p-4">
// <h1 className="text-2xl mb-4">User Location</h1>
// {location ? (
// <React.Fragment>
// <div className="mb-4">
// <h2 className="text-xl font-semibold">Your Location:</h2>
// <p>Latitude: {location.latitude}</p>
// <p>Longitude: {location.longitude}</p>
// </div>
// <div className="mb-4">
// <h2 className="text-xl font-semibold">User Selected Location:</h2>
// {clickLocation ? (
// <>
// <p>Latitude: {clickLocation.latitude}</p>
// <p>Longitude: {clickLocation.longitude}</p>
// </>
// ) : (
// <p>Click on the map to select a location.</p>
// )}
// </div>
// {distance !== null && (
// <div className="mb-4">
// <h2 className="text-xl font-semibold">Distance:</h2>
// <p>{distance.toFixed(2)} km</p>
// </div>
// )}
// <div className="flex justify-center">
// <div className="rounded-full md:rounded-3xl overflow-hidden shadow-lg" style={{ width: "500px", height: "500px" }}>
// <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
// <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
// <Marker position={[location.latitude, location.longitude]}>
// <Popup>You are here</Popup>
// </Marker>
// <Circle center={[location.latitude, location.longitude]} radius={3000} />
// <LocationMarker />
// <RestrictMapView />
// </MapContainer>
// </div>
// </div>
// </React.Fragment>
// ) : (
// <p>Getting location...</p>
// )}
// </div>
// );
// };

// export default HomePage;

import React from "react";
const page = () => {
  return <div>page</div>;
};
export default page;
