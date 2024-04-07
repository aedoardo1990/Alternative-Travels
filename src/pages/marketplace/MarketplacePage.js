import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Marketplace from "./Marketplace";
import Opinion from "../opinions/Opinion";
import OpinionCreateForm from "../opinions/OpinionCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";
import InfiniteScroll from "react-infinite-scroll-component";

function MarketplacePage() {
  const { id } = useParams();
  const [marketplace, setMarketplace] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [opinions, setOpinions] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: marketplace }, { data: opinions }] = await Promise.all([
          axiosReq.get(`/marketplace/${id}`),
          axiosReq.get(`/opinions/?marketplace=${id}`),

        ]);
        setMarketplace({ results: [marketplace] });
        setOpinions(opinions);
      } catch (err) {
        // console.log(err);
      }
    };
    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
      <PopularProfiles mobile />
        <Marketplace {...marketplace.results[0]} setMarketplaces={setMarketplace} marketplacePage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <OpinionCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              marketplace={id}
              setMarketplace={setMarketplace}
              setOpinions={setOpinions}
            />
          ) : opinions.results.length ? (
            "Comments"
          ) : null}
          {opinions.results.length ? (
            <InfiniteScroll
              children={
                opinions.results.map((opinion) => (
                  <Opinion
                    key={opinion.id}
                    {...opinion}
                    setMarketplace={setMarketplace}
                    setOpinions={setOpinions}
                  />
                ))
              }
              dataLength={opinions.results.length}
              loader={<Asset spinner />}
              hasMore={!!opinions.next}
              next={() => fetchMoreData(opinions, setOpinions)}
            />
          ) : currentUser ? (
            <span>No comments yet, what's on your mind?</span>
          ) : (
            <span>No comments yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
      <PopularProfiles />
      </Col>
    </Row>
  );
}

export default MarketplacePage;