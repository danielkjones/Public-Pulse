import React, {useState} from "react";
import {
  ListGroup,
  ListGroupItem,
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupButtonDropdown,
  Button,
  InputGroupAddon
} from "reactstrap";

export default ({ queriesList, setQuery, addQuery }) => {
  const [newQueryText, setNewQueryText] = useState("")
  return (
    <Container>
      <Row>
        <Col>
          <InputGroup>
            <Input  onChange={(e) => setNewQueryText(e.target.value)} value={newQueryText}/>
            <InputGroupAddon>
              <Button onClick={() => addQuery(newQueryText)}>Add</Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col>
          <ListGroup>
            {queriesList.map(queryString => (
              <ListGroupItem onClick={() => setQuery(queryString)}>
                {queryString}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};
