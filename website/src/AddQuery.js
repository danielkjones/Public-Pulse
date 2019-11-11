import React, { useState } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from "reactstrap";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import uuidv1 from "uuid/v1";

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
  let [inputValue, setInputValue] = useState("");
  let input;
  let [
    seeIfKeewordExists,
    {
      loading: seeIfKeywordExistsLoading,
      error: keywordAlreadyExistsError,
      data
    }
  ] = useLazyQuery(KEYWORD_EXISTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network"
  });
  const keywordAlreadyExists = data && data.keywordByWord;

  const [
    addKeyword,
    { loading: addKeywordLoading, error: addKeywordError }
  ] = useMutation(ADD_KEYWORD);

  return (
    <Container>
      <Row>
        <Col>
          {keywordAlreadyExistsError && (
            <Alert color="primary">
              Error determining if keyword already exists
            </Alert>
          )}
          {addKeywordError && (
            <Alert color="danger">Error tracking hashtag</Alert>
          )}
          {keywordAlreadyExists && (
            <Alert color="primary">
              Cannot add hashtag - it is already being tracked
            </Alert>
          )}
          <input
            value={inputValue}
            onChange={event => {
              setInputValue(event.target.value);
              seeIfKeewordExists({ variables: { word: event.target.value } });
            }}
          ></input>
          {seeIfKeywordExistsLoading && <Spinner></Spinner>}
          {!seeIfKeywordExistsLoading && (
            <Button
              disabled={
                addKeywordLoading ||
                !inputValue ||
                keywordAlreadyExists ||
                keywordAlreadyExistsError
              }
              onClick={() => {
                let id = getRandomInt(10000000);
                addKeyword({
                  variables: {
                    word: inputValue,
                    clientMutationId: uuidv1(),
                    id: id
                  }
                }).finally(() => {
                  setInputValue("");
                  onAdd();
                });
              }}
            >
              Add Hashtag
            </Button>
          )}
          {addKeywordLoading && "Adding new hashtag..."}
        </Col>
      </Row>
    </Container>
  );
};
