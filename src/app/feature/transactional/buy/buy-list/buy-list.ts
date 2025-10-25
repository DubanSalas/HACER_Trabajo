import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

interface Purchase {
  id: number
  producto: string
  categoria: string
  stock: string
  precioUnit: string
  proveedor: string
  vencimiento: string
  estado: string
}

@Component({
  selector: "app-buy-list",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./buy-list.html",
  styleUrls: ["./buy-list.scss"],
})
export class BuyList{
  purchases: Purchase[] = [
    {
      id: 1,
      producto: "Harina de Trigo",
      categoria: "Ingredientes Básicos",
      stock: "250 kg",
      precioUnit: "$2.5",
      proveedor: "Distribuidora La Costeña",
      vencimiento: "2024/06/15",
      estado: "Disponible",
    },
    {
      id: 2,
      producto: "Harina de Trigo",
      categoria: "Ingredientes Básicos",
      stock: "250 kg",
      precioUnit: "$2.5",
      proveedor: "Distribuidora La Costeña",
      vencimiento: "2024/06/15",
      estado: "Disponible",
    },
    {
      id: 3,
      producto: "Harina de Trigo",
      categoria: "Ingredientes Básicos",
      stock: "250 kg",
      precioUnit: "$2.5",
      proveedor: "Distribuidora La Costeña",
      vencimiento: "2024/06/15",
      estado: "Agotado",
    },
    {
      id: 4,
      producto: "Harina de Trigo",
      categoria: "Ingredientes Básicos",
      stock: "250 kg",
      precioUnit: "$2.5",
      proveedor: "Distribuidora La Costeña",
      vencimiento: "2024/06/15",
      estado: "Disponible",
    },
    {
      id: 5,
      producto: "Harina de Trigo",
      categoria: "Ingredientes Básicos",
      stock: "250 kg",
      precioUnit: "$2.5",
      proveedor: "Distribuidora La Costeña",
      vencimiento: "2024/06/15",
      estado: "Disponible",
    },
    {
      id: 6,
      producto: "Harina de Trigo",
      categoria: "Ingredientes Básicos",
      stock: "250 kg",
      precioUnit: "$2.5",
      proveedor: "Distribuidora La Costeña",
      vencimiento: "2024/06/15",
      estado: "Disponible",
    },
    {
      id: 7,
      producto: "Harina de Trigo",
      categoria: "Ingredientes Básicos",
      stock: "250 kg",
      precioUnit: "$2.5",
      proveedor: "Distribuidora La Costeña",
      vencimiento: "2024/06/15",
      estado: "Disponible",
    },
  ]

  stats = [
    { label: "Total Productos", value: "8", icon: "📦" },
    { label: "Stock Bajo", value: "2", icon: "⚠️" },
    { label: "Agotadas", value: "0", icon: "🔔" },
    { label: "Próximos a Vencer", value: "7", icon: "⏰" },
  ]
}
