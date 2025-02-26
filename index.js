"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleComplete = exports.handleError = exports.handleRequest = exports.requestsMock = exports.userMock = exports.HTTP_STATUS_INTERNAL_SERVER_ERROR = exports.HTTP_STATUS_OK = exports.HTTP_GET_METHOD = exports.HTTP_POST_METHOD = exports.Observable = exports.Observer = void 0;
var Observer = /** @class */ (function () {
    function Observer(handlers) {
        this.handlers = handlers;
        this.isUnsubscribed = false;
    }
    Observer.prototype.next = function (value) {
        if (this.handlers.next && !this.isUnsubscribed) {
            this.handlers.next(value);
        }
    };
    Observer.prototype.error = function (error) {
        if (!this.isUnsubscribed) {
            if (this.handlers.error) {
                this.handlers.error(error);
            }
            this.unsubscribe();
        }
    };
    Observer.prototype.complete = function () {
        if (!this.isUnsubscribed) {
            if (this.handlers.complete) {
                this.handlers.complete();
            }
            this.unsubscribe();
        }
    };
    Observer.prototype.unsubscribe = function () {
        this.isUnsubscribed = true;
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    };
    return Observer;
}());
exports.Observer = Observer;
var Observable = /** @class */ (function () {
    function Observable(subscribe) {
        this._subscribe = subscribe;
    }
    Observable.from = function (values) {
        return new Observable(function (observer) {
            values.forEach(function (value) { return observer.next(value); });
            observer.complete();
            return function () {
                console.log("unsubscribed");
            };
        });
    };
    Observable.prototype.subscribe = function (handlers) {
        var observer = new Observer(handlers);
        observer["_unsubscribe"] = this._subscribe(observer);
        return {
            unsubscribe: function () {
                observer.unsubscribe();
            },
        };
    };
    return Observable;
}());
exports.Observable = Observable;
exports.HTTP_POST_METHOD = "POST";
exports.HTTP_GET_METHOD = "GET";
exports.HTTP_STATUS_OK = 200;
exports.HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
exports.userMock = {
    name: "User Name",
    age: 26,
    roles: ["user", "admin"],
    createdAt: new Date(),
    isDeleated: false,
};
exports.requestsMock = [
    {
        method: exports.HTTP_POST_METHOD,
        host: "service.example",
        path: "user",
        body: exports.userMock,
        params: {},
    },
    {
        method: exports.HTTP_GET_METHOD,
        host: "service.example",
        path: "user",
        params: {
            id: "3f5h67s4s",
        },
    },
];
var handleRequest = function (request) {
    // handling of request
    return { status: exports.HTTP_STATUS_OK };
};
exports.handleRequest = handleRequest;
var handleError = function (error) {
    // handling of error
    return { status: exports.HTTP_STATUS_INTERNAL_SERVER_ERROR };
};
exports.handleError = handleError;
var handleComplete = function () { return console.log("complete"); };
exports.handleComplete = handleComplete;
var requests$ = Observable.from(exports.requestsMock);
var subscription = requests$.subscribe({
    next: exports.handleRequest,
    error: exports.handleError,
    complete: exports.handleComplete,
});
subscription.unsubscribe();
