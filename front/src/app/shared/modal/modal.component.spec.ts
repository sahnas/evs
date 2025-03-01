import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-host',
  template: `
    <app-modal
      [isOpen]="isModalOpen"
      title="Test Modal"
      (closeModal)="closeModalHandler()"
    >
      <p>Test Content</p>
    </app-modal>
  `,
})
class TestHostComponent {
  isModalOpen = false;
  closeModalHandler = jest.fn();

  openModal(): void {
    this.isModalOpen = true;
  }
}

describe('ModalComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should not display modal when isOpen is false', () => {
    const modalElement = hostFixture.nativeElement.querySelector('.fixed');
    expect(modalElement).toBeNull();
  });

  it('should display modal when isOpen is true', () => {
    hostComponent.openModal();
    hostFixture.detectChanges();

    const modalElement = hostFixture.nativeElement.querySelector('.fixed');
    expect(modalElement).toBeTruthy();
  });

  it('should show the correct title', () => {
    hostComponent.openModal();
    hostFixture.detectChanges();

    const titleElement = hostFixture.nativeElement.querySelector('.text-lg');
    expect(titleElement.textContent.trim()).toBe('Test Modal');
  });

  it('should render content', () => {
    hostComponent.openModal();
    hostFixture.detectChanges();

    const contentElement = hostFixture.nativeElement.querySelector('p');
    expect(contentElement.textContent.trim()).toBe('Test Content');
  });

  it('should emit closeModal event when close button is clicked', () => {
    hostComponent.openModal();
    hostFixture.detectChanges();

    const closeButton = hostFixture.nativeElement.querySelector(
      'button[aria-label="Close"]'
    );
    closeButton.click();

    expect(hostComponent.closeModalHandler).toHaveBeenCalled();
  });

  it('should emit closeModal event when background overlay is clicked', () => {
    hostComponent.openModal();
    hostFixture.detectChanges();

    const overlay = hostFixture.nativeElement.querySelector(
      '.fixed.inset-0.bg-black'
    );
    overlay.click();

    expect(hostComponent.closeModalHandler).toHaveBeenCalled();
  });
});
