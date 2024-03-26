import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import styles from "../styles/LocationPicker.module.css";
import btnStyles from "../styles/Button.module.css";

function LocationPicker({ onConfirm, onClose, showTooltip, setShowTooltip, currentLocation }) {
  const target = useRef(null);

  // Instructions for picking location on map from react-leaflet docs:
  // https://react-leaflet.js.org/docs/example-events/
  const [location, setLocation] = useState(currentLocation?.length ? currentLocation : null);
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation([lat, lng]);
        setShowTooltip(false);
      },
    });

    return location === null ? null : <Marker position={location}></Marker>;
  }

  const confirmLocation = () => {
    onConfirm(location);
  };

  return (
    <div className={`${styles.LocationPicker} p-3 p-md-5`}>
      <div className={`${styles.Container} p-3`}>
        <h3>Select a location</h3>
        <MapContainer className={`${styles.Map}`} zoom={2} center={[51.505, -0.09]}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
          />
          <LocationMarker />
        </MapContainer>
        <div className="text-center">
          <Button className="mt-2 me-2" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            ref={target}
            className={`${btnStyles.YellowButton} ${btnStyles.Small} mt-2`}
            onClick={confirmLocation}
          >
            Confirm Location
          </Button>
          <Overlay target={target.current} show={showTooltip} placement="right">
            {(props) => (
              <Tooltip id="location-warning" {...props}>
                Please select a location on the map.
              </Tooltip>
            )}
          </Overlay>
        </div>
      </div>
    </div>
  );
}

export default LocationPicker;