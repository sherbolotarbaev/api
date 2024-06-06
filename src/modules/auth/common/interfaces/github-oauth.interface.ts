export interface IGitHubOauthUser {
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly photo?: string;
}

export interface IGitHubOauthEmails {
  readonly email: string;
  readonly primary: boolean;
  readonly verified: boolean;
  readonly visibility: string;
}
