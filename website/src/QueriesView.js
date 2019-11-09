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
  let [loadKeywords, { called, loading, data, error, refetch }] = useLazyQuery(
    GET_KEYWORDS
  );
  const [deleteKeyword] = useMutation(DELETE_KEYWORD);

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
          <ListGroup>
            {loading && <Spinner color="primary" />}
            {data &&
              data.allKeywords.edges.map(item => (
                <ListGroupItem >
                  <p onClick={() => setQueryIdAndWord(item.node)}>{JSON.stringify(item.node.word)}</p>
                  <Button
                    onClick={() =>

                      deleteKeyword({
                        variables: {
                          id: item.node.id
                        }
                      }).finally(refetch)
                    }
                  >
                    Remove
                  </Button>
                </ListGroupItem>
              ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};
