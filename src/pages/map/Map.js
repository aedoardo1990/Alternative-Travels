import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import styles from "../../styles/Map.module.css";

import Form from "react-bootstrap/Form";

import { axiosReq } from "../../api/axiosDefaults";
import MapPopup from "./MapPopup";
import Spinner from "react-bootstrap/Spinner";

const Map = () => {
  const [posts, setPosts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [query, setQuery] = useState("");
  //rendering geolocation icon - credits: https://www.youtube.com/watch?v=jD6813wGdBA&t=165s
  const customIcon = new Icon ({
    iconUrl: "https://res.cloudinary.com/duoyolryv/image/upload/v1712154322/marker-icon_tioctv.png",
    iconSize: [38, 38] // icon size
  })

  useEffect(() => {
    const fetchPosts = async () => {
      setHasLoaded(false);
      try {
        const { data } = await axiosReq.get(`/posts/?search=${query}`);
        let counter = 2;
        let next = data.next;
        while (next) {
          const { data: moreData } = await axiosReq.get(`/posts/?page=${counter}`);
          data.results.push(...moreData.results);
          counter++;
          next = moreData.next;
        }
        setPosts(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    if (query) {
      const queryTimer = setTimeout(() => {
        fetchPosts();
      }, 1000);
      return () => clearTimeout(queryTimer);
    } else {
      fetchPosts();
    }
  }, [query]);

  return (
    <MapContainer className={styles.Map} center={[0, 0]} zoom={2} scrollWheelZoom={true}>
      <div className={styles.SearchOverlay}>
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form className={styles.SearchBar} onSubmit={(event) => event.preventDefault()}>
          <Form.Control
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Filter posts by name, tags, or user"
          />
        </Form>
      </div>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hasLoaded ? (
        posts.results.map((post) => (
          <Marker key={post.id} position={[post.latitude, post.longitude]} icon={customIcon}>
            <Popup className={styles.Popup} minWidth={300}>
              <MapPopup {...post} />
            </Popup>
          </Marker>
        ))
      ) : (
        <div className={styles.SpinnerOverlay}>
          <Spinner />
        </div>
      )}
    </MapContainer>
  );
};

export default Map;