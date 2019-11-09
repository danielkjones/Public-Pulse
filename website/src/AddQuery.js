import React, { useState } from "react";
import {
  ListGroup,
  ListGroupItem,
  Container,
  Row,
  Col,
  Spinner,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupButtonDropdown,
  Button,
  InputGroupAddon
} from "reactstrap";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import uuidv1 from "uuid/v1";
import crypto from "crypto";

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

const ADD_KEYWORD = gql`
  mutation createKeywordMutation(
    $clientMutationId: String
    $id: Int
    $word: String!
  ) {
    createKeyword(
      input: {
        clientMutationId: $clientMutationId
        keyword: { id: $id, word: $word }
      }
    ) {
      keyword {
        id
        word
      }
    }
  }
`;


export default ({ onAdd }) => {
  let input;

  const [addKeyword, { data }] = useMutation(ADD_KEYWORD);

  return (
    <Container>
      <Row>
        <Col>
          <input
            ref={node => {
              input = node;
            }}
          ></input>
          <Button
            onClick={() => {
              let id = getRandomInt(10000000);
              addKeyword({
                variables: {
                  word: input.value,
                  clientMutationId: uuidv1(),
                  id: id
                }
              }).finally(() =>{
                onAdd()

              })

            }}
          >
            Add Hashtag
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
