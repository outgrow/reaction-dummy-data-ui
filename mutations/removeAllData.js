import gql from "graphql-tag";

export default gql`
  mutation removeAllData($input: RemoveDataInput!) {
    removeAllData(input: $input) {
      wasDataRemoved
    }
  }
`;
