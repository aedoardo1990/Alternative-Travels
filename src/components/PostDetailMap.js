import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import styles from "../styles/PostDetailMap.module.css";

const PostDetailMap = ({ post, rerender }) => {
  const [key, setKey] = useState(0);
  const [location, setLocation] = useState();

  useEffect(() => {
    setLocation(post.location);

    // Force the component to re-render when the sound details are displayed
    // in the PostsPage component by assigning a new key.
    // Instructions from: https://stackoverflow.com/questions/35792275/how-to-force-remounting-on-react-components
    setKey((previous) => previous + 1);
  }, [post, rerender]);

  return (
    <MapContainer key={key} className={styles.Map} center={location} zoom={6} scrollWheelZoom={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker key={post.id} position={location}></Marker>
    </MapContainer>
  );
};

export default PostDetailMap;