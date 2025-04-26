/* eslint-disable import/no-default-export */
import { gql } from '@apollo/client';

export const GQL_FETCH_COUNTRIES = gql`
  query FetchAllCountries {
    allCountries {
      chineseName
      englishName
      phoneAreaCode
    }
  }
`;

export default GQL_FETCH_COUNTRIES;
