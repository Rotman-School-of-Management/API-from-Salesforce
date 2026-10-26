import { Component, OnInit , ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // 1. Import it




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './app.css',
  templateUrl: './app.html',
})


export class App implements OnInit {
  //eventData: { Id: string; Name: string; Description: string } | null = null;
  eventData: any[] = [];
  private masterEventData: any[] = [];  // This keeps the original, unfiltered copy
  public searchQuery: string = ''; 
  errorMessage: string = '';
  public totalCount: number = 0; // To hold the count of filtered events

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    this.http.get('/api', { responseType: 'text' })
      .subscribe({
        next: (xmlString) => { this.parseXml(xmlString); },
        error: (err) => {
          this.errorMessage = 'Failed to load event data.';
          console.error(err);
        }
      });
  }
  private parseXml(xmlString: string) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

      // 2. Find all parent elements (e.g., assuming your tags are wrapped in <Event>)
      const eventNodes = xmlDoc.getElementsByTagName('Event');
      const parsedEvents = [];

      // 3. Loop through each event node and extract data
      for (let i = 0; i < eventNodes.length; i++) {
        const node = eventNodes[i];
        parsedEvents.push({
          Id: node.getElementsByTagName('Id')[0]?.textContent || '',
          Name: node.getElementsByTagName('Name')[0]?.textContent || '',
          PublishType: node.getElementsByTagName('PublishType')[0]?.textContent || '',
          Topics: node.getElementsByTagName('Topics')[0]?.textContent || '',
          EvdTentImage: node.getElementsByTagName('EvdTentImage')[0]?.textContent || '',
          Description: node.getElementsByTagName('Description')[0]?.textContent || ''
        });
      }

      // 4. Assign the completed array and trigger change detection
      this.masterEventData = parsedEvents;
      this.applyFilter(); 
      

    } catch (error) {
      this.errorMessage = 'Failed to parse XML data.';
      console.error(error);
    }
  }
  // 3. Add this helper method to filter the data based on your search query
  public applyFilter() {
    const query = this.searchQuery.toLowerCase().trim();
   
    if (!query) {
      this.eventData = [...this.masterEventData];
    } else {
      this.eventData = this.masterEventData.filter(event =>
        event.Name.toLowerCase().includes(query) ||
        event.Topics.toLowerCase().includes(query) ||
        event.PublishType.toLowerCase().includes(query) ||
        event.Description.toLowerCase().includes(query)
      );
    }
    this.totalCount = this.eventData.length;
    this.cdr.detectChanges();
  }
}
