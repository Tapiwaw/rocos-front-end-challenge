import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { RocosClient, FastLaneManager, IRocosTelemetryMessage } from 'rocos-js'
import { Observable, ReplaySubject } from 'rxjs';

export const rocosURL:string = 'https://api2.rocos.io';

@Injectable({
  providedIn: 'root'
})

export class TelemetryService {

  private _token:string = '';
  private _rocosClient: RocosClient; 
  private _fastLaneManager: FastLaneManager;

  private _authenticatedSubject: ReplaySubject<boolean>;

  constructor(){
    this._rocosClient = new RocosClient({ baseURL: rocosURL }); 
    this._fastLaneManager = new FastLaneManager( rocosURL );
    this._authenticatedSubject = new ReplaySubject<boolean>(1);
  }

  authenticate(appId:string, secretKey:string): void {
    this._rocosClient.user.applicationAuth(appId, secretKey).subscribe((res) => {
                                                                        this._token = res.data.token;
                                                                        this._rocosClient.updateToken(this._token);
                                                                        this._fastLaneManager.updateToken(this._token); 
                                                                        console.log('Authentication Successful!');
                                                                        // console.log('result', res);
                                                                        this._authenticatedSubject.next(true);

                                                                      }, (err) => {
                                                                        console.log('Authentication Failed');
                                                                        this._authenticatedSubject.next(false);
                                                                        console.error('error', err);
                                                                      });
  }

  stop(): void {
    console.log('Stop Telemetry Service');
    this._authenticatedSubject.next(false);
  }

  authentication():ReplaySubject<boolean>{
    return this._authenticatedSubject;
  }

  getTestTelemetryObservable():Observable<IRocosTelemetryMessage> {
    return this._fastLaneManager.subscribeV2({ projectId: 'front-end-challenge', 
                                                callsigns: ['drone-rocos'], 
                                                sources: ['/mavlink/ATTITUDE'], scope: '' });
  }

}
