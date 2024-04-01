import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import btnStyles from "../styles/Button.module.css";
import styles from "../styles/TagField.module.css";
import LocationPicker from "./LocationPicker";
import 'react-toastify/dist/ReactToastify.css';
import { successToast, errorToast } from "./Toasts";

const LocationField = ({ sendLocation, previousLocation, setButtonDisabled }) => {
  const [locationStatus, setLocationStatus] = useState(
    previousLocation ? previousLocation : "Please provide location data."
  );
  const [locationChanged, setLocationChanged] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(previousLocation ? previousLocation : []);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (locationChanged) {
      setButtonDisabled(true);
      setTimeout(() => {
        sendLocation(location);
        setLocationChanged(false);
        setButtonDisabled(false);
      }, 1500);
    }
  }, [location, locationChanged, sendLocation, setButtonDisabled]);

  const handleCloseMap = () => setShowMap(false);
  const handleShowMap = () => setShowMap(true);

  const handleSelectLocation = (location) => {
    if (location) {
      setLocation(location);
      setLocationChanged(true);
      handleCloseMap();
    } else {
      setShowTooltip(true);
    }
  };

  // Instructions for HTML Geolocation API: https://www.w3schools.com/html/html5_geolocation.asp
  const getLocation = () => {
    setLocationStatus("Retrieving location data... Please wait.");
    setButtonDisabled(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
          successToast("Geolocation loaded succesfully")
          setLocationChanged(true);
          setShowTooltip(false);
          setButtonDisabled(false);
        },
        (err) => {
          errorToast("Failed to retrieve geolocation")
          setLocationStatus("Could not retrieve location.");
        }
      );
    } else {
      // console.log("Geolocation is not supported by this browser.");
    }
  };
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        Location
      </Form.Label>
      <Form.Control className={styles.Input} name="location" placeholder={locationStatus} value={location} disabled />

      {showMap && (
        <LocationPicker
          onClose={handleCloseMap}
          onConfirm={handleSelectLocation}
          showTooltip={showTooltip}
          setShowTooltip={setShowTooltip}
          currentLocation={location}
        />
      )}

      {!previousLocation ? (
        <>
          <Button
            className={`${btnStyles.YellowButton} ${btnStyles.Small} me-2 mt-2`}
            variant="secondary"
            onClick={getLocation}
          >
            Get current location
          </Button>
          <Button className={`${btnStyles.YellowButton} ${btnStyles.Small} mt-2`} onClick={handleShowMap}>
            Select location on map
          </Button>
        </>
      ) : (
        <Button className={`${btnStyles.YellowButton} ${btnStyles.Small} mt-2`} onClick={handleShowMap}>
          Select new location
        </Button>
      )}
    </Form.Group>
  );
};

export default LocationField;