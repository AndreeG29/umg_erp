import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[canAccess]',
  standalone: true
})
export class CanAccessDirective implements OnInit {
  @Input() canAccess: string = '';
  @Input() permission: 'view' | 'create' | 'edit' | 'delete' = 'view';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkPermission();
  }

  private checkPermission(): void {
    let permissionCheck;
    
    switch (this.permission) {
      case 'create':
        permissionCheck = this.authService.canCreate(this.canAccess);
        break;
      case 'edit':
        permissionCheck = this.authService.canEdit(this.canAccess);
        break;
      case 'delete':
        permissionCheck = this.authService.canDelete(this.canAccess);
        break;
      default:
        permissionCheck = this.authService.canAccess(this.canAccess);
    }

    permissionCheck.subscribe(hasPermission => {
      if (hasPermission) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}