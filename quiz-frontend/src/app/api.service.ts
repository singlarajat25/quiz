import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Product } from './Product ';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
// const apiUrl = "https://jsonplaceholder.typicode.com/todos/1";
const BaseUrl = "http://localhost:3000";
const listOfquestion = BaseUrl+"/api/v1/question/";
const sendanswer = BaseUrl+"/api/v1/question/evaluate-answer";
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

       console.log("Errorlogges print");
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>(listOfquestion)
      .pipe(
        tap(heroes => console.log('fetched products')),
        catchError(this.handleError('getProducts', []))
      );
  }

  getProduct(id: number): Observable<Product> {
    const url = `${listOfquestion}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => console.log(`fetched product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  submit(product): Observable<Product> {
    return this.http.post<Product>(sendanswer, product, httpOptions).pipe(
      tap((product: Product) => console.log(`added product w/ id=`)),
      catchError(this.handleError<Product>('submit'))
    );
  }

}
