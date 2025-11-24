/// <reference types="jasmine" />

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ListComponent } from './list.component';
import { ItemsService } from '../../services/items.service';
import { Item } from '../../models/item.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let itemsServiceSpy: jasmine.SpyObj<ItemsService>;

  const mockItems: Item[] = [
    { id: 1, name: 'Item 1', description: 'Desc 1' },
    { id: 2, name: 'Item 2', description: 'Desc 2' },
  ];

  beforeEach(async () => {
    const itemsSpy = jasmine.createSpyObj('ItemsService', ['getItems']);

    await TestBed.configureTestingModule({
      imports: [ListComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [{ provide: ItemsService, useValue: itemsSpy }],
    }).compileComponents();

    itemsServiceSpy = TestBed.inject(ItemsService) as jasmine.SpyObj<ItemsService>;
  });

  const createComponent = () => {
      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  };

  it('should create', () => {
    itemsServiceSpy.getItems.and.returnValue(of(mockItems));
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should transition to error status on failed fetch', fakeAsync(() => {
    itemsServiceSpy.getItems.and.returnValue(throwError(() => new Error('Failed to fetch')));

    createComponent();

    // At the beginning (constructor call)
    expect(component.status()).toBe('error');

    tick(); // complete the async operation
    fixture.detectChanges();

    expect(component.status()).toBe('error');
    expect(component.error()).toBe('Failed to load items. Please try again later.');
    expect(component.items()).toEqual([]);
  }));

});
