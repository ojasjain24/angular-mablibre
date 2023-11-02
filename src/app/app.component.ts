import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  map: any;
  earthquakes: any;
  center :any;
  constructor(private http: HttpClient) {}
  styleObj: any = {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OpenStreetMap Contributors',
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'osm',
        type: 'raster',
        source: 'osm', // This must match the source key above
      },
    ],
  };
  async ngOnInit() {
    this.earthquakes = {
      "type": "FeatureCollection",
      "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      "features": []
      };

    const res : any = await this.post_api(
      'https://cos.iudx.org.in/iudx/cat/v1/internal/ui/dataset',
      { id: 'b74d3a25-e259-440a-be87-fed3b0b56bee' }
    );
    this.center=res[0].location.geometry.coordinates;

    for(const val of res){
      this.earthquakes.features.push(
        { "type": "Feature", "geometry": val.location.geometry })
    }
  }

  async post_api(url: string, post_body: Record<string, unknown>) {
    return new Promise((resolve, reject) => {
      this.http.post(url, post_body).subscribe(async (data: any) => {
        resolve(data['results'][0]['resource']);
      });
    });
  }
}
