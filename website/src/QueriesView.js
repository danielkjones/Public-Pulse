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
  InputGroupAddon,
  Alert
} from "reactstrap";
import { gql } from "apollo-boost";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import AddQuery from "./AddQuery";

import uuid from "uuid/v1"

const GET_KEYWORDS = gql`
  {
    allKeywords {
      edges {
        node {
          word
          id,
          active
        }
      }
    }
  }
`;

const DELETE_KEYWORD = gql`
  mutation deleteKeyword($word: String!, $clientMutationId: String) {
    updateKeywordByWord(input: {clientMutationId: $clientMutationId, word: $word, keywordPatch: {
      active: false
    }}){
      keyword {
        word,
        active
      }
    }
  }
`;

export default ({ setQueryIdAndWord }) => {
  let [
    loadKeywords,
    { called, loading, data, error, refetch, networkStatus }
  ] = useLazyQuery(GET_KEYWORDS);
  const [deleteKeyword, { loading: deleteKeywordLoading }] = useMutation(
    DELETE_KEYWORD
  );

  if (!called) {
    loadKeywords();
  }
  return (
    <Container>
      <Row>
        <Col>
          <AddQuery
            onAdd={() => {
              console.log("loaded queries");
              refetch();
            }}
          />
          {error && <Alert color="danger">Error fetching hashtags</Alert>}
          {deleteKeywordLoading && (
            <div>
              <h3>Removing hastag</h3>
              <Spinner />
            </div>
          )}
          <ListGroup>
            {data &&
              data.allKeywords.edges
                .filter(item => {
                  return item.node.active === true;
                })
                .map(item => (
                  <ListGroupItem>
                    <p onClick={() => setQueryIdAndWord(item.node)}>
                      {JSON.stringify(item.node.word)}
                    </p>
                    <Button
                      onClick={() =>
                        deleteKeyword({
                          variables: {
                            word: item.node.word,
                            clientMutationId: uuid(),
                          }
                        }).finally(() => {
                          refetch();
                        })
                      }
                      disabled={deleteKeywordLoading}
                    >
                      Remove
                    </Button>
                  </ListGroupItem>
                ))}
            {loading && (
              <ListGroupItem>
                <Spinner />
              </ListGroupItem>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};
