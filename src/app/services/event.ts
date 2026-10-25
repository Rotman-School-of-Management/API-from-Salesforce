import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import * as xml2js from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // Replace with your actual external XML URL
  private xmlUrl = 'https://community.rotman.utoronto.ca/events/services/apexrest/api/events';
  //private xmlUrl = '/api';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    return this.http.get(this.xmlUrl, { responseType: 'text' }).pipe(
      map(xmlString => {
        let parsedData: any;

        // Parse XML string to JavaScript Object
        xml2js.parseString(xmlString, { explicitArray: false, mergeAttrs: true }, (err, result) => {
          if (err) {
            throw new Error('Error parsing XML data');
          }
          parsedData = result;
        });

        return parsedData;
      })
    );
  }
}
