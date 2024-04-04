import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Marketplace from "./Marketplace";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function MarketplacePage() {
  const { id } = useParams();
  const [marketplace, setMarketplace] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: marketplace }] = await Promise.all([
          axiosReq.get(`/marketplace/${id}`),
        ]);
        setMarketplace({ results: [marketplace] });
      } catch (err) {
        console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
      <PopularProfiles mobile />
        <Marketplace {...marketplace.results[0]} setMarketplaces={setMarketplace} marketplacePage />
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
      <PopularProfiles />
      </Col>
    </Row>
  );
}

export default MarketplacePage;