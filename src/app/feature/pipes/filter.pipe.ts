import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/product.model';

@Pipe({ name: 'filterData' })
export class FilterDataPipe implements PipeTransform {
    transform(product: Product[], searchTerm: string): Product[] {
        if (!product || !searchTerm) {
            return product;
        } else {
            return product.filter(user => user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
        }
    }
}
