import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import StudentSet from "./StudentSet";
import StudentModal from "./StudentModal";
import axios from "axios";
import { API_URL } from "../constants";

class MyHome extends Component {
  state = {
    students: []
  };

  componentDidMount() {
    this.resetState();
  }

  getStudents = () => {
    axios.get(API_URL).then(
        res => {
            console.log('hhh' + res);
            this.setState({ students: res.data });
        }
    );
  };

  resetState = () => {
    this.getStudents();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Row>
          <Col>
            <StudentSet
              students={this.state.students}
              resetState={this.resetState}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <StudentModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MyHome;