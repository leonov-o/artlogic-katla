import {Component, OnInit} from '@angular/core';
import {HiveSection} from "../models/hive-section";
import {HiveListItem} from "../models/hive-list-item";
import {ActivatedRoute, Router} from "@angular/router";
import {HiveSectionService} from "../services/hive-section.service";
import {HiveService} from "../services/hive.service";
import {ProductCategory} from "../../product-management/models/product-category";

@Component({
  selector: 'app-hive-section-form',
  templateUrl: './hive-section-form.component.html',
  styleUrls: ['./hive-section-form.component.css']
})
export class HiveSectionFormComponent implements OnInit {

  hiveSection = new HiveSection(0, "", "", 0, false, "");
  existed = false;
  storeHiveId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hiveSectionService: HiveSectionService) {
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      // if (p['sectionId'] === undefined) return;
      if (p['id']) {
        this.storeHiveId = p['id'];
      } else {
        this.storeHiveId = this.hiveSection.storeHiveId;
      }

      if (p['sectionId'] === undefined) {
        this.hiveSection.storeHiveId = this.storeHiveId;
        return;
      }
      this.hiveSectionService.getHiveSection(p['sectionId']).subscribe(s => this.hiveSection = s);
      this.existed = true;
    });
  }

  navigateToSections() {
    this.router.navigate([`/hive/${this.hiveSection.storeHiveId}/sections`]);
  }

  onCancel() {
    this.navigateToSections();
  }

  onSubmit() {
    if (this.existed) {
      this.hiveSectionService.updateHiveSection(this.hiveSection).subscribe(c => this.navigateToSections());
    } else {
      this.hiveSectionService.addHiveSection(this.storeHiveId, this.hiveSection).subscribe(c => this.navigateToSections());
    }
  }

  onDelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, true).subscribe(c => this.hiveSection.isDeleted = true);
  }

  onUndelete() {
    this.hiveSectionService.setHiveSectionStatus(this.hiveSection.id, false).subscribe(c => this.hiveSection.isDeleted = false);
  }

  onPurge() {
    if (this.hiveSection.isDeleted) {
      this.hiveSectionService.deleteHiveSection(this.hiveSection.id).subscribe(() => this.navigateToSections());
    }

  }
}
