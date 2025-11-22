import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';

interface MenuItem {
    label: string;
    icon: string;
    route?: string;
    children?: MenuItem[];
    expanded?: boolean;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, MaterialModule],
    templateUrl: './sidebar.html',
    styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
    @Input() collapsed = false;
    @Output() sidebarToggle = new EventEmitter<boolean>();

    menuItems: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard'
        },
        {
            label: 'Ventas',
            icon: 'point_of_sale',
            route: '/sales'
        },
        {
            label: 'Productos',
            icon: 'bakery_dining',
            route: '/products'
        },
        {
            label: 'Clientes',
            icon: 'people',
            route: '/customers'
        },
        {
            label: 'Empleados',
            icon: 'badge',
            route: '/employees'
        },
        {
            label: 'Proveedores',
            icon: 'local_shipping',
            route: '/suppliers'
        },
        {
            label: 'Almacén',
            icon: 'inventory',
            route: '/store'
        }
    ];

    toggleMenu(item: MenuItem): void {
        if (item.children) {
            item.expanded = !item.expanded;
        }
    }

    onToggleSidebar(): void {
        this.collapsed = !this.collapsed;
        this.sidebarToggle.emit(this.collapsed);
    }
}