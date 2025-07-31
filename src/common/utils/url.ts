export class Url {
  private readonly baseUrl: string;
  private apiVersion: string | null = null;
  private pathSegments: string[] = [];
  private queryParams: Record<string, any> = {};

  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  public static base(baseUrl: string): Url {
    return new Url(baseUrl);
  }

  public version(version: string): Url {
    this.apiVersion = version;
    return this;
  }

  public path(...paths: string[]): Url {
    this.pathSegments.push(...paths.map(p => p.replace(/^\/+|\/+$/g, '')));
    return this;
  }

  public query(params: Record<string, any>): Url {
    this.queryParams = { ...this.queryParams, ...params };
    return this;
  }

  public toString(): string {
    const pathParts = [this.baseUrl];

    if (this.apiVersion) {
      pathParts.push(this.apiVersion);
    }

    if (this.pathSegments.length > 0) {
      pathParts.push(...this.pathSegments);
    }

    let url = pathParts.join('/');

    const queryString = this.buildQueryString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  private buildQueryString(): string {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(this.queryParams)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    return params.toString();
  }
}
