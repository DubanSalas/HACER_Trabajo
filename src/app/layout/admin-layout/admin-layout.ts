import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { Header } from "../components/header/header";  // Asegúrate de que estos componentes estén correctamente importados
import { Sidebar } from "../components/sidebar/sidebar";  // Asegúrate de que estos componentes estén correctamente importados

@Component({
  selector: "app-admin-layout",
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    Header,  // Importa correctamente tu componente de Header
    Sidebar  // Importa correctamente tu componente de Sidebar
  ],
  templateUrl: "./admin-layout.html",
  styleUrls: ["./admin-layout.scss"],
})
export class AdminLayout {
  // Aquí puedes agregar la lógica de tu componente si es necesario
}
