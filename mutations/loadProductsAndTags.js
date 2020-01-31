import gql from "graphql-tag";

export default gql`
  mutation loadProductsAndTags($input: LoadProductsAndTagsInput!) {
    loadProductsAndTags(input: $input) {
      productsCreated,
      tagsCreated
    }
  }
`;
