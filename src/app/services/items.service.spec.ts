/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemsService } from './items.service';
import { Item } from '../models/item.model';
import { API_ENDPOINTS } from '../config/api.config';

describe('ItemsService', () => {
  let service: ItemsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemsService],
    });
    service = TestBed.inject(ItemsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch items successfully', (done) => {
    const mockItems: Item[] = [
      { id: 1, name: 'Item 1', description: 'Description 1' },
      { id: 2, name: 'Item 2', description: 'Description 2' },
    ];

    service.getItems().subscribe(items => {
      expect(items).toEqual(mockItems);
      done();
    });

    const req = httpTestingController.expectOne(API_ENDPOINTS.items);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should handle errors when fetching items', (done) => {
    service.getItems().subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error).toBeTruthy();
        done();
      },
    });

    const req = httpTestingController.expectOne(API_ENDPOINTS.items);
    req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });
  });
});
