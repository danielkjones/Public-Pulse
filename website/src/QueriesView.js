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

const GET_KEYWORDS = gql`
  {
    allKeywords {
      edges {
        node {
          word
          id
        }
      }
    }
  }
`;

const DELETE_KEYWORD = gql`
  mutation deleteKeyword($id: Int!) {
    deleteKeywordById(input: { id: $id }) {
      deletedKeywordId
    }
  }
`;

export default ({ setQueryIdAndWord }) => {
  let [loadKeywords, { called, loading, data, error, refetch, networkStatus }] = useLazyQuery(
    GET_KEYWORDS
  );
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
          {JSON.stringify({
            called: called,
            loading: loading,
            data: data,
            error: error,
            refetch: refetch,
            networkStatus: networkStatus
          }, null, 4)}
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
              data.allKeywords.edges.map(item => (
                <ListGroupItem>
                  <p onClick={() => setQueryIdAndWord(item.node)}>
                    {JSON.stringify(item.node.word)}
                  </p>
                  <Button
                    onClick={() =>
                      deleteKeyword({
                        variables: {
                          id: item.node.id
                        }
                      })
                      .finally(() => {
                        refetch()
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
