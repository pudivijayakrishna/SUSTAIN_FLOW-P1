import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import config from "../config.js";

export default function Footer() {
  return (
    <>
      <div className="mt-5">&nbsp;</div>
      <div className="mt-5">&nbsp;</div>
      <MDBFooter
        className="text-center text-lg-start text-muted"
        style={{ backgroundColor: "#DFFFFF" }}
      >
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            <a href="#" className="me-4 text-reset">
              <MDBIcon fab icon="youtube" />
            </a>
            <a href="#" className="me-4 text-reset">
              <MDBIcon fab icon="instagram" />
            </a>
            <a href="#" className="me-4 text-reset">
              <MDBIcon fab icon="linkedin" />
            </a>
            <a href="#" className="me-4 text-reset">
              <MDBIcon fab icon="github" />
            </a>
          </div>
        </section>

        <section className="">
          <MDBContainer className="text-center text-md-start mt-5">
            <MDBRow className="mt-3">
              <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <MDBIcon icon="gem" className="me-3" />
                  TEAM-10
                </h6>
                <p>
                “There must be a better way to make the things we want, a way that doesn't spoil the sky, or the rain or the land.” - Paul McCartney.
                </p>
              </MDBCol>
             
            </MDBRow>
          </MDBContainer>
        </section>

        <div
          className="text-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          <a className="text-reset fw-bold" href="https://github.com/pudivijayakrishna?tab=repositories">
            TEAM-10
          </a>
        </div>
      </MDBFooter>
    </>
  );
}
