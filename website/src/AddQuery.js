import React, { useState } from "react";
import { Container, Row, Col, Spinner, Button, Alert } from "reactstrap";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import uuidv1 from "uuid/v1";
import axios from "axios"

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
      active
    }
  }
`;

const MAKE_KEYWORD_ACTIVE = gql`
  mutation markKeywordInactive($word: String!, $clientMutationId: String) {
    updateKeywordByWord(
      input: {
        clientMutationId: $clientMutationId
        word: $word
        keywordPatch: { active: true }
      }
    ) {
      keyword {
        word
        active
      }
    }
  }
`;

export default ({ onAdd }) => {
  let [inputValue, setInputValue] = useState("");

  const [makeKeywordActive] = useMutation(MAKE_KEYWORD_ACTIVE);
  const [
    addKeyword,
    { loading: addKeywordLoading, error: addKeywordError }
  ] = useMutation(ADD_KEYWORD);
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
  const keywordAlreadyExistsAndIsActive =
    keywordAlreadyExists && data.keywordByWord.active;

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
          {keywordAlreadyExists && keywordAlreadyExistsAndIsActive && (
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
          {!seeIfKeywordExistsLoading && !keywordAlreadyExistsAndIsActive && (
            <Button
              disabled={
                addKeywordLoading ||
                !inputValue ||
                (keywordAlreadyExists && keywordAlreadyExistsAndIsActive) ||
                keywordAlreadyExistsError
              }
              onClick={() => {
                if (keywordAlreadyExists) {
                  makeKeywordActive({
                    variables: {
                      word: inputValue,
                      clientMutationId: uuidv1()
                    }
                  }).then(() => {
                    axios.get("https://wxk312x9i2.execute-api.us-east-1.amazonaws.com/default/Test-Queue-Function")
                  }).finally(() => {
                    setInputValue("");
                    seeIfKeewordExists({ variables: { word: "" } })
                    onAdd();
                  });
                } else {
                  let id = getRandomInt(10000000);
                  addKeyword({
                    variables: {
                      word: inputValue,
                      clientMutationId: uuidv1(),
                      id: id
                    }
                  }).then(() =>{
                    axios.get("https://wxk312x9i2.execute-api.us-east-1.amazonaws.com/default/Test-Queue-Function")
                  }).finally(() => {
                    setInputValue("");
                    onAdd();
                  });
                }
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
