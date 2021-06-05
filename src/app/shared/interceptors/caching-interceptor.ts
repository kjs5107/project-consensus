import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { filter, first, share, shareReplay, tap } from "rxjs/operators";

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    private cache: Record<string, Observable<HttpEvent<any>>> = {};
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method !== "GET") {
            return next.handle(req);
        }
        
        const cachedResponse = this.cache[req.urlWithParams] ||
        (this.cache[req.urlWithParams] = next.handle(req).pipe(
            filter((res) => res instanceof HttpResponse),
            shareReplay(1),
        ));

        return cachedResponse.pipe(first())
    }

}
