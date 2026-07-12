import { HttpParams } from '@angular/common/http';

export class QueryParamsBuilder {
  private params = new HttpParams();

  set(key: string, value: unknown): this {
    if (value !== null && value !== undefined) {
      this.params = this.params.set(key, String(value));
    }

    return this;
  }

  append(key: string, value: unknown): this {
    if (value !== null && value !== undefined) {
      this.params = this.params.append(key, String(value));
    }

    return this;
  }

  build(): HttpParams {
    return this.params;
  }
}