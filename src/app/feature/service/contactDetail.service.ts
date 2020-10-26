import { Injectable } from '@angular/core';
import { Category, Product } from '../models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class ContactDetailService {
    /**
     * @var contactDetail
     * Will Hold contact Detail
     */

    private contactDetail: Product[] = [];
    private categoryArr: Category[] = [
        { id: 1, name: 'PII' },
        { id: 2, name: 'Level 0' },
        { id: 3, name: 'Level 1' },
        { id: 4, name: 'Public' }
    ];

    constructor() {
    }

    /**
     * @method getContactList
     * To get Contact List
     */
    getContactList() {
        const list = JSON.parse(localStorage.getItem('contactDetail')) || [];
        return list;
    }

    /**
     * @method getContactDetail
     * @param index
     * To get Contact Detail depends on Index
     */
    getContactDetail(index) {
        const list = this.getContactList();
        return list[index];
    }

    setContactDetail(list) {
        localStorage.setItem('contactDetail', JSON.stringify(list));
    }

    /**
     * @method addContact
     * @param data
     * Method to add user Detail to contact Detail list
     */
    addContact(data) {
        const list = this.getContactList();
        list.unshift(data);
        this.setContactDetail(list);
    }
    /**
     * @method updateContactList
     * @param index
     * @param data
     * Method to update user Detail to contact Detail list using index and user Data
     */
    updateContactList(index, data) {
        const list = this.getContactList();
        list[index] = data;
        this.setContactDetail(list);
    }

    /**
     * @method checkEmailAndPassword
     * @param index
     * Method to check Email And Password
     */
    checkEmailAndPassword(email: any, password: any) {
        if (email === 'ratan@test.com' && password === '12345') {
            sessionStorage.setItem('email', email);
            return true;
        } else {
            return false;
        }
    }

    getCategoryName(id) {
        // tslint:disable-next-line: curly
        if (id === 'all') return 'All';
        let itemName = '';
        this.categoryArr.forEach(element => {
            if (element.id == id) {
                itemName = element.name;
            }
        });
        return itemName;
    }

    getCategoryArr() {
        return this.categoryArr;
    }

    getTrendScore(upVoteCount: number, downVoteCunt: number): number {
        if (upVoteCount && downVoteCunt) {
            return (upVoteCount / (upVoteCount + downVoteCunt)) * 100;
        }
        return 0;
    }

    getUniqueID() {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    updateTrendScoreInLocal(id, voteType) {
        const list = this.getContactList();
        list.map(item => {
            if (item.id === id) {
                item[voteType] = item[voteType] + 1;
                item.trend_score = this.getTrendScore(item.upvote_count, item.downvote_count);
            }
        });
        this.setContactDetail(list);
    }

}
