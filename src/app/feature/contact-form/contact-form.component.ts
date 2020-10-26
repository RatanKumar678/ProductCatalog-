import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContactDetailService } from '../service/contactDetail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  // contact from object
  contactFrom: FormGroup;
  // check from action update or aad new user
  submitTypeUpdate = false;
  submitStatus = false;
  // get user detail getting id from url
  id: number;
  contactFromDetail: Product;

  constructor(private fb: FormBuilder, private contactDetailService: ContactDetailService,
    private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit() {
    // create user detail form
    this.creatFrom();
    // get id from url
    this.getUserId();
  }

  /**
   * @method getUserId
   * Method to get Id from URL paramMap
   */
  getUserId() {
    this.activatedRoute.paramMap.subscribe(data => {
      console.log(data.get('id'));
      if (data.get('id')) {
        this.submitTypeUpdate = true;
        this.id = +data.get('id');
        this.getDetail(this.id);
      }
    });
  }

  /**
   * @method creatFrom
   * Method to create user Detail from object
   */
  creatFrom() {
    this.contactFrom = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('[0-9 ]*')]],
      category_id: ['', [Validators.required]],
      tags: this.fb.array([])
    });
  }

  tags(): FormArray {
    return this.contactFrom.get('tags') as FormArray;
  }

  newTag(name): FormGroup {
    return this.fb.group({
      nameTag: name,
    });
  }

  addTag(event) {
    this.tags().push(this.newTag(event.value));
    event.value = '';
  }

  removeTag(i: number) {
    this.tags().removeAt(i);
  }

  /**
   * @method getDetail
   * @param id
   * Method to to get user detail depends on id
   */
  getDetail(id: number) {
    this.contactFromDetail = this.contactDetailService.getContactDetail(id);
    this.contactFrom.patchValue(this.contactFromDetail);
  }

  /**
   * getter to get form controls
   */
  get f() { return this.contactFrom.controls; }

  /**
   * @method onSubmit
   * method to update and add user detail
   */
  onSubmit() {

    // // // stop here if form is invalid
    if (this.contactFrom.invalid) {
      this.contactFrom.markAsTouched();
      return;
    }
    this.submitStatus = true;
    const productDetail = {
      ...this.contactFrom.value
    };
    if (this.contactFromDetail) {

      productDetail.upvote_count = this.contactFromDetail.upvote_count || 0;
      productDetail.downvote_count = this.contactFromDetail.downvote_count || 0;
      productDetail.id = this.contactFromDetail.id || this.contactDetailService.getUniqueID();
    } else {
      productDetail.upvote_count = 0;
      productDetail.downvote_count = 0;
      productDetail.id = this.contactDetailService.getUniqueID();
    }

    productDetail.trend_score = this.contactDetailService.getTrendScore(productDetail.upvote_count, productDetail.downvote_count);

    // debugger;
    if (!this.submitTypeUpdate) {
      this.contactDetailService.addContact(productDetail);
      this.contactFrom.reset();
      this.route.navigate(['/contact-list'], {
        queryParams: { updatedData: 0 }
      });
    } else {
      this.contactDetailService.updateContactList(this.id, productDetail);
      this.route.navigate(['/contact-list'], {
        queryParams: { updatedData: this.id }
      });
    }
  }

}
