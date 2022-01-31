import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import { GET_NEAR_ORGANIZATION } from "../../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Container,
  Card,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import ReactMapGL, { Marker, Popup, Source, Layer } from "react-map-gl";
import markerUser from "../../images/mapbox-marker-icon-20px-blue.png";
import markerNGO from "../../images/mapbox-marker-icon-20px-red.png";
var turf = require("@turf/turf");
// import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// mapboxgl.accessToken =
//   "pk.eyJ1IjoibXVoZGFmaXFhZndhbiIsImEiOiJja3lmb2Q2aTAwMG83MnhvbGpobjExNzdoIn0.51DA8Mi__6SWGIzIoqniIA";

const DonorHomePage = () => {
  const { user } = useContext(AuthContext);
  if (!window.location.hash) {
    window.location = window.location + "#loaded";
    window.location.reload();
  }
  // const ref = useRef(null);
  // const [map, setMap] = useState(null);
  // useEffect(() => {
  //   if (ref.current && !map) {
  //     const map = new mapboxgl.Map({
  //       container: ref.current,
  //       style: "mapbox://styles/mapbox/streets-v11",
  //       center: [
  //         parseFloat(user.user.longLat.split(",")[0].trim()),
  //         parseFloat(user.user.longLat.split(",")[1].trim()),
  //       ],
  //       zoom: 14,
  //     });
  //     setMap(map);
  //   }
  // }, [ref, map]);

  const [viewport, setViewport] = useState({
    latitude: parseFloat(user.user.longLat.split(",")[1].trim()),
    longitude: parseFloat(user.user.longLat.split(",")[0].trim()),
    width: 920,
    height: 400,
    zoom: 11,
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedLocation(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setUserLocation(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  const { loading, error, data } = useQuery(GET_NEAR_ORGANIZATION, {
    variables: {
      maxDistance: 10000,
      longitude: parseFloat(user.user.longLat.split(",")[0].trim()),
      latitude: parseFloat(user.user.longLat.split(",")[1].trim()),
    },
  });

  let size = 25;

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(user.user.longLat.split(",")[0].trim()),
            parseFloat(user.user.longLat.split(",")[1].trim()),
          ],
        },
      },
    ],
  };

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": {
        base: 2,
        stops: [
          [0, 0],
          [
            20,
            10000 /
              0.075 /
              Math.cos(
                (user.user.longLat.split(",")[1].trim() * Math.PI) / 180
              ),
          ],
        ],
      },
      "circle-color": "#007cbf",
      "circle-opacity": 0.2,
    },
  };

  if (loading)
    return (
      <Spinner
        style={{
          position: "fixed",
          top: "15%",
          left: "50%",
        }}
        animation="border"
      />
    );
  if (error) return `Error! ${error.message}`;

  return (
    <Container>
      <h2 className="font-weight-light text-center mt-3">
        <b>Food Banks Near Me</b>
      </h2>
      <h5 className="text-center font-weight-light">
        Share foods. Save lives.
      </h5>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "450px",
        }}
      >
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={(viewport) => {
            setViewport(viewport);
          }}
        >
          <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>

          {/* user's location marker */}
          <Marker
            key={user.user._id}
            latitude={parseFloat(user.user.longLat.split(",")[1].trim())}
            longitude={parseFloat(user.user.longLat.split(",")[0].trim())}
          >
            <button
              style={{ transform: `translate(${-size / 2}px,${-size}px)` }}
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault();
                setUserLocation(user.user);
              }}
            >
              <img src={markerUser} />
            </button>
          </Marker>

          {userLocation ? (
            <Popup
              latitude={parseFloat(userLocation.longLat.split(",")[1].trim())}
              longitude={parseFloat(userLocation.longLat.split(",")[0].trim())}
              offsetTop={-15}
              onClose={() => {
                setUserLocation(null);
              }}
            >
              <div>
                <p>You are here</p>
              </div>
            </Popup>
          ) : null}

          {/* ngo's location marker */}
          {data.nearOrganizations.map((organizations) => (
            <Marker
              key={organizations._id}
              latitude={parseFloat(organizations.longLat.split(",")[1].trim())}
              longitude={parseFloat(organizations.longLat.split(",")[0].trim())}
            >
              <button
                style={{ transform: `translate(${-size / 2}px,${-size}px)` }}
                className="marker-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedLocation(organizations);
                }}
              >
                <img src={markerNGO} />
              </button>
            </Marker>
          ))}

          {selectedLocation ? (
            <Popup
              latitude={parseFloat(
                selectedLocation.longLat.split(",")[1].trim()
              )}
              longitude={parseFloat(
                selectedLocation.longLat.split(",")[0].trim()
              )}
              offsetTop={-15}
              onClose={() => {
                setSelectedLocation(null);
              }}
            >
              <div>
                <h3>{selectedLocation.name}</h3>
                <p>{selectedLocation.description}</p>
                <Link
                  to={`/organizationDetails/${selectedLocation._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    className="float-right"
                    variant="primary"
                    type="submit"
                  >
                    View
                  </Button>
                </Link>
                <Badge variant="dark">
                  {" "}
                  {turf
                    .distance(
                      turf.point([
                        parseFloat(user.user.longLat.split(",")[0].trim()),
                        parseFloat(user.user.longLat.split(",")[1].trim()),
                      ]),
                      turf.point([
                        parseFloat(
                          selectedLocation.longLat.split(",")[0].trim()
                        ),
                        parseFloat(
                          selectedLocation.longLat.split(",")[1].trim()
                        ),
                      ]),
                      { units: "kilometers" }
                    )
                    .toFixed(2)}{" "}
                  km away
                </Badge>
              </div>
            </Popup>
          ) : null}
        </ReactMapGL>
      </div>
      <Row className="justify-content-sm-center mt-4 mb-5">
        <Col lg="10">
          <Row xs={1} md={3} className="g-4">
            {data.nearOrganizations.map((organizations) => (
              <Col key={organizations._id}>
                <Link
                  className="link-ngo"
                  to={`/organizationDetails/${organizations._id}`}
                >
                  <Card className="card-ngo">
                    <Card.Body>
                      <Card.Title>{organizations.name}</Card.Title>
                      <Card.Text style={{ textAlign: "justify" }}>
                        {organizations.description}
                      </Card.Text>
                      <Badge variant="dark">
                        {turf
                          .distance(
                            turf.point([
                              parseFloat(
                                user.user.longLat.split(",")[0].trim()
                              ),
                              parseFloat(
                                user.user.longLat.split(",")[1].trim()
                              ),
                            ]),
                            turf.point([
                              parseFloat(
                                organizations.longLat.split(",")[0].trim()
                              ),
                              parseFloat(
                                organizations.longLat.split(",")[1].trim()
                              ),
                            ]),
                            { units: "kilometers" }
                          )
                          .toFixed(2)}{" "}
                        km away
                      </Badge>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DonorHomePage;
