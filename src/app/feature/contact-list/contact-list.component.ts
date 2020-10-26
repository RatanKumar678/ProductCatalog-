import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactDetailService } from '../service/contactDetail.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  // will hold user details
  contactList: Product[] = [];
  // To store user active index
  activeIndex = null;
  // To store search Term
  searchTerm: string;
  SearchType = 'all';

  constructor(private route: Router, private contactDetailService: ContactDetailService, private activatedRoute: ActivatedRoute) { }

  /**
   * @method ngOnInit
   * To get init value for List component
   */
  ngOnInit() {
    this.contactList = Object.assign([], this.contactDetailService.getContactList());
    this.getQueryParams();
    this.removeQueryParamsAfterGetting();
    this.removeActiveClass();
    setTimeout(() => {
      const element = document.getElementById('globalSearch');
      if (element) {
        element.focus();
      }
    }, 1000);
  }

  /**
   * @method getQueryParams
   * method to get Query param from URL
   */
  getQueryParams() {
    if (this.activatedRoute.snapshot.queryParamMap.get('updatedData')) {
      this.activeIndex = this.activatedRoute.snapshot.queryParamMap.get('updatedData');
    }
  }

  /**
   * @method removeQueryParamsAfterGetting
   * method to Reset URL
   */
  removeQueryParamsAfterGetting() {
    this.route.navigate([], {
      queryParams: {
        updatedData: null
      },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * @method removeActiveClass
   * method to remove Class from list to inactive selected data
   */
  removeActiveClass() {
    setTimeout(() => {
      const elements = document.getElementsByClassName('list');
      if (elements) {
        for (let i = 0; i <= elements.length; i++) {
          if (elements[i] && elements[i].classList && elements[i].classList.contains('ActiveList')) {
            setTimeout(() => {
              elements[i].classList.remove('ActiveList');
            }, 1200);
          }
        }
        setTimeout(() => {
          this.activeIndex = null;
        }, 2000);
      }
    });
  }

  /**
   * @method editContact
   * redirect to contact form with ID to update user info
   */
  editContact(index) {
    this.route.navigate(['/contact/edit', index]);
    this.activeIndex = null;
  }

  searchBySideNav(type) {
    this.SearchType = type;
    const allProductData = Object.assign([], this.contactDetailService.getContactList());
    this.contactList = [];
    if (type == 'all') {
      this.contactList = allProductData;
    } else {
      this.contactList = allProductData.filter(item => {
        return item.category_id == type;
      });
    }
  }

  voteCount(id, voteType) {
    this.contactList.map(item => {
      if (item.id === id) {
        item[voteType] = item[voteType] + 1;
        item.trend_score = this.contactDetailService.getTrendScore(item.upvote_count, item.downvote_count);
        this.contactDetailService.updateTrendScoreInLocal(id, voteType);
      }
    });
    // this.contactList.sort((a, b) => {
    //   return b.trend_score - a.trend_score;
    // });
  }

}
