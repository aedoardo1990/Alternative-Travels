import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Marketplace from "./Marketplace";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";

import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function MarketplacesPage({ message, filter = "" }) {
    const [marketplaces, setMarketplaces] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchMarketplaces = async () => {
            try {
                const { data } = await axiosReq.get(`/marketplace/?${filter}search=${query}`);
                setMarketplaces(data);
                setHasLoaded(true);
            } catch (err) {
                // console.log(err);
            }
        };

        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchMarketplaces();
        }, 1000)
        return () => {
            clearTimeout(timer);
        };

    }, [filter, query, pathname]);

    return (
        <Row className="h-100 mt-4">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                <i className={`fas fa-search ${styles.SearchIcon}`} />
                <Form
                    className={styles.SearchBar}
                    onSubmit={(event) => event.preventDefault()}
                >
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search by tag, post or user"
                    />
                </Form>
                {hasLoaded ? (
                    <>
                        {marketplaces.results.length ? (
                            <InfiniteScroll
                                children={
                                    marketplaces.results.map((marketplace) => (
                                        <Marketplace key={marketplace.id} {...marketplace} setMarketplaces={setMarketplaces} />
                                    ))
                                }
                                dataLength={marketplaces.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!marketplaces.next}
                                next={() => fetchMoreData(marketplaces, setMarketplaces)}
                            />
                        ) : (
                            <Container className={appStyles.Content}>
                                <Asset src={NoResults} message={message} />
                            </Container>
                        )}
                    </>
                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}
            </Col>
            <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default MarketplacesPage;