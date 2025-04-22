import { gql } from "@apollo/client";

export const makeBlockTimeQuery = (blockHeight: number) => gql`
{
  blocks(
    filter: {
      from_height: ${blockHeight}
      to_height: ${blockHeight + 1}
    }
    size: 1
  ) {
    edges {
      block {
        time
      }
    }
  }
}
`;
