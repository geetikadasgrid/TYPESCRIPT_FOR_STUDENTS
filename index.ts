export type Handler<T> = {
  next?: (value: T) => void;
  error?: (error: unknown) => void;
  complete?: () => void;
};

export type Unsubscribe = () => void;

export type Request = {
  method: "POST" | "GET";
  host: string;
  path: string;
  body?: User;
  params?: Record<string, string>;
};

export type User = {
  name: string;
  age: number;
  roles: string[];
  createdAt: Date;
  isDeleated: boolean;
};

export type Response = {
  status: number;
};

export class Observer<T> {
  private handlers: Handler<T>;
  private isUnsubscribed: boolean;
  private _unsubscribe?: Unsubscribe;

  constructor(handlers: Handler<T>) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  next(value: T): void {
    if (this.handlers.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  error(error: unknown): void {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        this.handlers.error(error);
      }

      this.unsubscribe();
    }
  }

  complete(): void {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }

      this.unsubscribe();
    }
  }

  unsubscribe(): void {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

export class Observable<T> {
  private _subscribe: (observer: Observer<T>) => Unsubscribe;

  constructor(subscribe: (observer: Observer<T>) => Unsubscribe) {
    this._subscribe = subscribe;
  }

  static from<T>(values: T[]): Observable<T> {
    return new Observable((observer) => {
      values.forEach((value) => observer.next(value));

      observer.complete();

      return () => {
        console.log("unsubscribed");
      };
    });
  }

  subscribe(handlers: Handler<T>): { unsubscribe: Unsubscribe } {
    const observer = new Observer(handlers);

    observer["_unsubscribe"] = this._subscribe(observer);

    return {
      unsubscribe() {
        observer.unsubscribe();
      },
    };
  }
}

export const HTTP_POST_METHOD = "POST" as const;
export const HTTP_GET_METHOD = "GET" as const;

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export const userMock: User = {
  name: "User Name",
  age: 26,
  roles: ["user", "admin"],
  createdAt: new Date(),
  isDeleated: false,
};

export const requestsMock: Request[] = [
  {
    method: HTTP_POST_METHOD,
    host: "service.example",
    path: "user",
    body: userMock,
    params: {},
  },
  {
    method: HTTP_GET_METHOD,
    host: "service.example",
    path: "user",
    params: {
      id: "3f5h67s4s",
    },
  },
];

export const handleRequest = (request: Request): Response => {
  // handling of request
  return { status: HTTP_STATUS_OK };
};

export const handleError = (error: unknown): Response => {
  // handling of error
  return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR };
};

export const handleComplete = (): void => console.log("complete");

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete,
});

subscription.unsubscribe();
