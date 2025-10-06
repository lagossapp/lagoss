import type { H3Event } from 'h3';

export class Github {
  private clientId: string;
  private clientSecret: string;

  constructor({ clientId, clientSecret }: { clientId: string; clientSecret: string }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private getClient(token: string) {
    return $fetch.create({
      baseURL: 'https://api.github.com',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  public getOauthRedirectUrl({
    state,
    scopes: _scopes,
    redirectUri,
  }: {
    state: string;
    scopes?: string[];
    redirectUri?: string;
  }): string {
    const scopes = _scopes || ['read:user', 'user:email'];

    const query = new URLSearchParams({
      client_id: this.clientId,
      state,
      scope: scopes.join(' '),
      redirect_uri: redirectUri || '',
    });

    return `https://github.com/login/oauth/authorize?${query.toString()}`;
  }

  public async getUserInfo(token: string) {
    const githubUser = await this.getClient(token)<{ name: string; avatar_url: string; email: string; id: string }>(
      '/user',
    );

    const githubEmails = await this.getClient(token)<
      {
        email: string;
        primary: boolean;
        verified: boolean;
        visibility: 'public' | 'private';
      }[]
    >('/user/emails');

    return {
      name: githubUser.name,
      avatarUrl: githubUser.avatar_url,
      email: (githubEmails.find(e => e.primary) ?? githubEmails[0]).email,
      remoteUserId: githubUser.id.toString(),
    };
  }

  public async oauthCallback(event: H3Event) {
    const { code } = getQuery(event);

    if (!code) {
      throw new Error('No code provided');
    }
    const response = await $fetch<{ error?: string; access_token: string; expires_in: string; refresh_token?: string }>(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: 'authorization_code',
        },
        ignoreResponseError: true,
      },
    );
    if (response.error) {
      console.error(response.error);
      throw new Error('Error getting access token');
    }

    return {
      accessToken: response.access_token,
      accessTokenExpiresIn: response.expires_in || -1, // We use -1 as github access_tokens issued by oauth apps don't expire
      refreshToken: response.refresh_token || null, // Use null as oauth apps don't return refresh tokens
    };
  }

  public async refreshToken(refreshToken: string) {
    const response = await $fetch<{ error?: string; access_token: string; expires_in: string; refresh_token?: string }>(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
      },
    );
    if (response.error) {
      console.error(response);
      throw new Error('Error refreshing access token');
    }

    return {
      accessToken: response.access_token,
      accessTokenExpiresIn: response.expires_in,
      refreshToken: null, // TODO: we use an empty string for now as github access_tokens don't expire
    };
  }
}
