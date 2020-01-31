import gql from "graphql-tag";

export default gql`
  mutation loadProductImages($input: LoadProductImagesInput!) {
    loadProductImages(input: $input) {
      wasDataLoaded
    }
  }
`;
