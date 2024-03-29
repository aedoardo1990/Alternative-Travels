import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/PostsPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function Notifications({ message, filter = "" }) {
    const [notifications, setNotifications] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await axiosReq.get(`/notifications/?${filter}search=${query}`);
                setNotifications(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };

        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchNotifications();
        }, 1000)
        return () => {
            clearTimeout(timer);
        };

    }, [filter, query, pathname]);


    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                {hasLoaded ? (
                    <>
                        {notifications.results.length ? (
                            <InfiniteScroll
                                children={
                                    notifications.results.map((notification) => (
                                        <div key={notification.id} {...notification} setNotifications={setNotifications} />
                                    ))
                                }
                                dataLength={notifications.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!notifications.next}
                                next={() => fetchMoreData(notifications, setNotifications)}
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
    )
}

export default Notifications;