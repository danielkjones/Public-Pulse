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
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
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

const KEYWORD_EXISTS = gql`
  query keywordExists($word: String!) {
    keywordByWord(word: $word) {
      id
    }
  }
`;

export default ({ onAdd }) => {
  let input;
  let [
    seeIfKeewordExists,
    { called, loading, keywordExists, error, refetch, data }
  ] = useLazyQuery(KEYWORD_EXISTS);
  if (!called) {
    // seeIfKeewordExists({ variables: { word: input && input.value } });
  }

  const [addKeyword] = useMutation(ADD_KEYWORD);

  return (
    <Container>
      <Row>
        <Col>
          <input
            onChange={() => seeIfKeewordExists({ variables: { word: input && input.value }})}
            ref={node => {
              input = node;
            }}
          ></input>
          <Button
            disabled={data && data.keywordByWord}
            onClick={() => {
              let id = getRandomInt(10000000);
              addKeyword({
                variables: {
                  word: input.value,
                  clientMutationId: uuidv1(),
                  id: id
                }
              }).finally(() => {
                onAdd();
              });
            }}
          >
            Add Hashtag
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
