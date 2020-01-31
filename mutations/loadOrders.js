import gql from "graphql-tag";

export default gql`
  mutation loadOrders($input: LoadOrdersInput!) {
    loadOrders(input: $input) {
      ordersCreated
    }
  }
`;
