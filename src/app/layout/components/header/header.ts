import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { MatDividerModule } from "@angular/material/divider"
import { MatButtonModule } from "@angular/material/button"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatDividerModule, MatButtonModule],
  templateUrl: "./header.html",
  styleUrls: ["./header.scss"],
})
export class Header {
  systemName = "Sistema de DeliPedidos"
  companyName = "DeliPedidos"
  notificationCount = 3
}
