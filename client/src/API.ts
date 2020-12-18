/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type VlollyInput = {
  id?: string | null,
  receiver?: string | null,
  message?: string | null,
  sender?: string | null,
  top?: string | null,
  middle?: string | null,
  bottom?: string | null,
};

export type CreateVlollyMutationVariables = {
  lolly?: VlollyInput | null,
};

export type CreateVlollyMutation = {
  createVlolly:  {
    __typename: "Vlolly",
    id: string | null,
    receiver: string | null,
    message: string | null,
    sender: string | null,
    top: string | null,
    middle: string | null,
    bottom: string | null,
  } | null,
};

export type ListVlollyQuery = {
  listVlolly:  Array< {
    __typename: "Vlolly",
    id: string | null,
    receiver: string | null,
    message: string | null,
    sender: string | null,
    top: string | null,
    middle: string | null,
    bottom: string | null,
  } | null > | null,
};
