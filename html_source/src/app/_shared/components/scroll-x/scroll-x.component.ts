import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-scroll-x',
  templateUrl: './scroll-x.component.html',
  styleUrls: ['./scroll-x.component.scss']
})
export class ScrollXComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollMenu') scrollMenu: ElementRef;

  @Input() scrollDistance = 300;

  rightDisabled = true;

  leftDisabled = true;

  scrollSmooth = true;

  // For dragging
  private mouseDown = false;

  private startX: any;

  private scrollLeft: any;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScroll();
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkScroll(), 0);
  }

  actionScrollLeft() {
    this.scrollMenu.nativeElement.scrollLeft -= this.scrollDistance;
    this.checkScroll();
  }

  actionScrollRight() {
    this.scrollMenu.nativeElement.scrollLeft += this.scrollDistance;
    this.checkScroll();
  }

  onScroll() {
    this.checkScroll();
  }

  checkScroll() {
    this.scrollMenu.nativeElement.scrollLeft === 0 ? this.leftDisabled = true : this.leftDisabled = false;

    const newScrollLeft = this.scrollMenu.nativeElement.scrollLeft;
    const width = this.scrollMenu.nativeElement.clientWidth;
    const scrollWidth = this.scrollMenu.nativeElement.scrollWidth;
    scrollWidth - (newScrollLeft + width) < 20 ? this.rightDisabled = true : this.rightDisabled = false;
  }

  startDragging(e): void {
    e.preventDefault();
    this.scrollSmooth = false;
    this.mouseDown = true;
    this.startX = e.pageX - this.scrollMenu.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollMenu.nativeElement.scrollLeft;
  }

  stopDragging(e): void {
    e.preventDefault();
    this.scrollSmooth = true;
    this.mouseDown = false;
  }

  mouseMove(e): void {
    e.preventDefault();
    if (!e || !this.mouseDown) {
      return;
    }
    const x = e.pageX - this.scrollMenu.nativeElement.offsetLeft;
    const scroll = x - this.startX;
    this.scrollMenu.nativeElement.scrollLeft = this.scrollLeft - scroll;
  }
}
