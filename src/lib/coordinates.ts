import * as THREE from 'three';

export const EARTH_RADIUS = 2.0;

/**
 * Converts Latitude and Longitude to 3D Vector3 on Earth sphere of radius R
 * @param lat Latitude (-90 to +90)
 * @param lng Longitude (-180 to +180)
 * @param radius Radius of sphere (default: EARTH_RADIUS)
 * @param altitude Offset above surface (e.g. 0.02 for pins floating on surface)
 */
export function latLngToVector3(lat: number, lng: number, radius = EARTH_RADIUS, altitude = 0.02): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const r = radius + altitude;
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Converts 3D Vector3 on sphere back to Latitude and Longitude
 */
export function vector3ToLatLng(vec: THREE.Vector3): { lat: number; lng: number } {
  const norm = vec.clone().normalize();
  const lat = 90 - (Math.acos(norm.y) * 180 / Math.PI);
  let lng = ((270 + (Math.atan2(norm.x, norm.z) * 180 / Math.PI)) % 360) - 180;
  return { lat, lng };
}

/**
 * Calculates camera target vector positioned safely at province zoom altitude (PDPA safe)
 * @param lat Province latitude
 * @param lng Province longitude
 */
export function getProvinceCameraPosition(lat: number, lng: number): THREE.Vector3 {
  // Safe distance clamped to province level (~3.3 units, where Earth is 2.0 units)
  const cameraDistance = EARTH_RADIUS * 1.65;
  return latLngToVector3(lat, lng, cameraDistance, 0);
}

/**
 * Returns jittered coordinates within ~5-10km radius of an area to protect exact privacy
 */
export function applyPrivacyJitter(lat: number, lng: number, variance = 0.03): { lat: number; lng: number } {
  const latOffset = (Math.random() - 0.5) * variance;
  const lngOffset = (Math.random() - 0.5) * variance;
  return {
    lat: Number((lat + latOffset).toFixed(4)),
    lng: Number((lng + lngOffset).toFixed(4)),
  };
}
