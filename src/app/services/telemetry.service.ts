import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { RocosClient, FastLaneManager, RobotController } from 'rocos-js'
import { ReplaySubject } from 'rxjs';

export const rocosURL:string = 'https://api2.rocos.io';

@Injectable({
  providedIn: 'root'
})

export class TelemetryService {

  private _token:string = '';
  private _authenticated:boolean = false;
  private _rocosClient: RocosClient; 
  private _fastLaneManager: FastLaneManager;

  private _authenticatedSubject: ReplaySubject<boolean>;

  constructor(){
    this._rocosClient = new RocosClient({ baseURL: rocosURL }); 
    this._fastLaneManager = new FastLaneManager( rocosURL );
    this._authenticatedSubject = new ReplaySubject<boolean>(1);
  }

  authenticate(appId:string, secretKey:string) {
    this._rocosClient.user.applicationAuth(
      appId,
      secretKey,
    ).subscribe((res) => {

      this._token = res.data.token;

      this._rocosClient.updateToken(this._token);
      this._fastLaneManager.updateToken(this._token); 
      this._authenticated = true;
      console.log('Authentication Successful!');
      // console.log('result', res);
      this._authenticatedSubject.next(true);

    }, (err) => {
      this._authenticated = false;
      console.log('Authentication Failed');
      this._authenticatedSubject.next(false);
      console.error('error', err);
    });
  }

  authentication()
  {
    return this._authenticatedSubject;
  }

  getTestTelemetrySubject() {
    return this._fastLaneManager.subscribe('front-end-challenge',
                                          ['drone-rocos'],
                                          ['/mavlink/ATTITUDE']).subject;
  }

}
