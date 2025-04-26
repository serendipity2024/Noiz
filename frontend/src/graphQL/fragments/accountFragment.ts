import { gql } from '@apollo/client';

export const GQL_ACCOUNT_FRAGMENT = gql`
  fragment accountFragment on Account {
    exId
    email
    phoneNumber
    profileImageUrl
    username
    displayName
    tags {
      hasSeenIntro
      hasUpdatedUserProfile
    }
    userProfile {
      ageRange
      industry
    }
  }
`;
