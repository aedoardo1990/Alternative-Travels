import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import styles from "../styles/PostDetailMap.module.css";
import { Icon } from "leaflet";

const PostDetailMap = ({ post, rerender }) => {
  const [key, setKey] = useState(0);
  const [location, setLocation] = useState();

  //rendering geolocation icon - credits: https://www.youtube.com/watch?v=jD6813wGdBA&t=165s
  const customIcon = new Icon ({
    iconUrl: "https://res.cloudinary.com/duoyolryv/image/upload/v1711978223/marker-icon_qfvc0k.png",
    iconSize: [38, 38] // icon size
  })

  useEffect(() => {
    setLocation(post.location);

    // Force the component to re-render when the post details are displayed
    // in the PostsPage component by assigning a new key.
    // Credits: https://stackoverflow.com/questions/35792275/how-to-force-remounting-on-react-components
    setKey((previous) => previous + 1);
  }, [post, rerender]);

  return (
    <div>
    {post.location ? (
    <MapContainer key={key} className={styles.Map} center={location} zoom={6} scrollWheelZoom={false}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker key={post.id} position={location} icon={customIcon}></Marker>
  </MapContainer>
    ) : (
    <span> loading... </span>
    )}
    </div>
    );
};

export default PostDetailMap;