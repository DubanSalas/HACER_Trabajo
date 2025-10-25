import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ConfigToggleComponent } from "../../../shared/components/config-toggle/config-toggle.component";

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, ConfigToggleComponent],
  templateUrl: "./sidebar.html",
  styleUrls: ["./sidebar.scss"],
})
export class Sidebar {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    { label: "Dashboard", icon: "dashboard", route: "/dashboard" },
    { label: "Proveedores", icon: "local_shipping", route: "/suppliers" },
    { label: "Empleado", icon: "people", route: "/employees" },
    { label: "Clientes", icon: "person", route: "/customers" },
    { label: "Productos", icon: "inventory_2", route: "/products" },
    { label: "Ventas", icon: "shopping_cart", route: "/sales" },
    { label: "Almacen", icon: "warehouse", route: "/store" },
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
