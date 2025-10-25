-- =====================================================
-- ARCHIVO DATA.SQL COMPLETO - SISTEMA DE PANADERÍA
-- =====================================================

-- 1. INSERTAR UBICACIONES (LOCATION)
INSERT INTO LOCATION (
    department,
    province,
    district,
    address
) VALUES 
    ('Lima', 'Lima', 'Lima', 'Av. Principal 123'),
    ('Lima', 'Lima', 'Miraflores', 'Av. Larco 456'),
    ('Lima', 'Lima', 'San Isidro', 'Av. Javier Prado 789'),
    ('Lima', 'Lima', 'Surco', 'Av. Benavides 321'),
    ('Lima', 'Lima', 'La Molina', 'Av. La Universidad 654'),
    ('Arequipa', 'Arequipa', 'Cercado', 'Calle Mercaderes 111'),
    ('Cusco', 'Cusco', 'San Blas', 'Plaza San Blas 222'),
    ('Trujillo', 'Trujillo', 'Centro', 'Jr. Pizarro 333');

-- 2. INSERTAR CARGOS/POSICIONES (POSITION)
INSERT INTO position (
    Position_Name,
    Description,
    Status
) VALUES 
    ('Gerente', 'Gerente general de la empresa', 'A'),
    ('Panadero', 'Especialista en panadería', 'A'),
    ('Cajero', 'Encargado de caja y atención al cliente', 'A'),
    ('Vendedor', 'Vendedor de productos', 'A'),
    ('Repostero', 'Especialista en repostería', 'A'),
    ('Supervisor', 'Supervisor de producción', 'A'),
    ('Almacenero', 'Encargado de almacén', 'A'),
    ('Contador', 'Contador de la empresa', 'A');

-- 3. INSERTAR EMPLEADOS (EMPLOYEE)
INSERT INTO employee (
    Employee_Code,
    Document_Type,
    Document_Number,
    Name,
    Surname,
    Hire_Date,
    Phone,
    id_Location,
    Salary,
    Email,
    id_Position,
    Status
) VALUES 
    ('EMP001', 'DNI', '12345678', 'Mario', 'González Pérez', '2023-01-15', '987123456', 1, 4500.00, 'mario.gonzalez@panaderia.com', 1, 'A'),
    ('EMP002', 'DNI', '12345679', 'Ana', 'Martín López', '2023-02-01', '987123457', 1, 3500.00, 'ana.martin@panaderia.com', 2, 'A'),
    ('EMP003', 'DNI', '12345680', 'Carlos', 'Ruiz Sánchez', '2023-03-10', '987123458', 2, 2800.00, 'carlos.ruiz@panaderia.com', 3, 'A'),
    ('EMP004', 'DNI', '12345681', 'Laura', 'Fernández García', '2023-04-05', '987123459', 2, 2500.00, 'laura.fernandez@panaderia.com', 4, 'A'),
    ('EMP005', 'DNI', '12345682', 'José', 'Torres Mendoza', '2023-05-20', '987123460', 3, 3800.00, 'jose.torres@panaderia.com', 5, 'A'),
    ('EMP006', 'DNI', '12345683', 'María', 'Vásquez Rojas', '2023-06-15', '987123461', 3, 3200.00, 'maria.vasquez@panaderia.com', 6, 'A'),
    ('EMP007', 'DNI', '12345684', 'Pedro', 'Morales Castro', '2023-07-01', '987123462', 4, 2600.00, 'pedro.morales@panaderia.com', 7, 'A'),
    ('EMP008', 'DNI', '12345685', 'Carmen', 'Jiménez Silva', '2023-08-10', '987123463', 4, 4000.00, 'carmen.jimenez@panaderia.com', 8, 'A');

-- 4. INSERTAR PROVEEDORES (SUPPLIER)
INSERT INTO supplier (
    Company_Name,
    Contact_Name,
    Phone,
    Email,
    Address,
    Category,
    Payment_Terms,
    id_Location,
    Status
) VALUES 
    ('Distribuidora La Moderna S.A.C.', 'Carlos Mendoza', '987654321', 'ventas@lamoderna.com', 'Av. Industrial 100', 'Harinas y Cereales', '30 Días', 1, 'A'),
    ('Lácteos del Valle E.I.R.L.', 'Rosa Paredes', '987654322', 'contacto@lacteosvallle.com', 'Jr. Los Lácteos 200', 'Productos Lácteos', '15 Días', 2, 'A'),
    ('Azúcar y Más S.A.', 'Miguel Herrera', '987654323', 'info@azucarymas.com', 'Av. Dulce 300', 'Endulzantes', '45 Días', 3, 'A'),
    ('Frutas Selectas S.R.L.', 'Elena Vargas', '987654324', 'pedidos@frutasselectas.com', 'Mercado Central 400', 'Frutas y Verduras', '7 Días', 4, 'A'),
    ('Especias del Mundo S.A.C.', 'Roberto Chávez', '987654325', 'ventas@especiasmundo.com', 'Jr. Condimentos 500', 'Especias y Condimentos', '30 Días', 5, 'A'),
    ('Empaques Industriales S.A.', 'Lucía Moreno', '987654326', 'contacto@empaquesind.com', 'Zona Industrial 600', 'Empaques y Envases', '60 Días', 6, 'S'),
    ('Insumos Panaderos S.R.L.', 'Fernando Quispe', '987654327', 'info@insumospanaderos.com', 'Av. Panadería 700', 'Insumos Especializados', '30 Días', 7, 'I');

-- 5. INSERTAR CLIENTES (CUSTOMER)
INSERT INTO customer (
    Client_Code,
    Document_Type,
    Document_Number,
    Name,
    Surname,
    Date_Birth,
    Phone,
    Email,
    id_Location,
    Register_Date,
    Status
) VALUES 
    ('C001', 'DNI', '87654321', 'Pedro', 'García Vásquez', '1990-05-15', '987321654', 'pedro.garcia@email.com', 1, CURRENT_DATE, 'A'),
    ('C002', 'DNI', '87654322', 'María', 'González Ruiz', '1985-08-22', '987321655', 'maria.gonzalez@email.com', 2, CURRENT_DATE, 'A'),
    ('C003', 'DNI', '87654323', 'Juan', 'López Martín', '1992-12-10', '987321656', 'juan.lopez@email.com', 3, CURRENT_DATE, 'A'),
    ('C004', 'DNI', '87654324', 'Ana', 'Martín Sánchez', '1988-03-18', '987321657', 'ana.martin@email.com', 4, CURRENT_DATE, 'A'),
    ('C005', 'DNI', '87654325', 'Carlos', 'Fernández Torres', '1995-07-25', '987321658', 'carlos.fernandez@email.com', 5, CURRENT_DATE, 'A'),
    ('C006', 'DNI', '87654326', 'Laura', 'Ruiz Morales', '1987-11-30', '987321659', 'laura.ruiz@email.com', 1, CURRENT_DATE, 'A'),
    ('C007', 'DNI', '87654327', 'José', 'Sánchez Vega', '1993-04-12', '987321660', 'jose.sanchez@email.com', 2, CURRENT_DATE, 'A'),
    ('C008', 'DNI', '87654328', 'Carmen', 'Torres Jiménez', '1991-09-08', '987321661', 'carmen.torres@email.com', 3, CURRENT_DATE, 'A'),
    ('C009', 'DNI', '87654329', 'Roberto', 'Vega Castillo', '1989-01-20', '987321662', 'roberto.vega@email.com', 4, CURRENT_DATE, 'A'),
    ('C010', 'DNI', '87654330', 'Elena', 'Castillo Herrera', '1994-06-14', '987321663', 'elena.castillo@email.com', 5, CURRENT_DATE, 'A');

-- 6. INSERTAR PRODUCTOS (PRODUCT)
INSERT INTO product (
    Product_Code,
    Product_Name,
    Category,
    Description,
    Price,
    Stock,
    Initial_Stock,
    Image_Url,
    Status
) VALUES 
    ('P001', 'Croissant de Mantequilla', 'Panadería', 'Delicioso croissant de mantequilla recién horneado', 3.50, 48, 100, '/images/croissant.jpg', 'A'),
    ('P002', 'Pan Francés', 'Panadería', 'Pan francés tradicional con corteza crujiente', 2.00, 200, 200, '/images/pan-frances.jpg', 'A'),
    ('P003', 'Tarta de Chocolate', 'Repostería', 'Exquisita tarta de chocolate con cobertura', 25.00, 12, 20, '/images/tarta-chocolate.jpg', 'A'),
    ('P004', 'Tarta de Vainilla', 'Repostería', 'Suave tarta de vainilla con crema', 22.00, 8, 15, '/images/tarta-vainilla.jpg', 'A'),
    ('P005', 'Pan Integral', 'Panadería', 'Pan integral rico en fibra', 4.50, 80, 100, '/images/pan-integral.jpg', 'A'),
    ('P006', 'Empanadas de Pollo', 'Panadería', 'Empanadas rellenas de pollo', 5.00, 60, 80, '/images/empanada-pollo.jpg', 'A'),
    ('P007', 'Cheesecake de Fresa', 'Repostería', 'Cheesecake con mermelada de fresa', 28.00, 6, 10, '/images/cheesecake-fresa.jpg', 'A'),
    ('P008', 'Donas Glaseadas', 'Repostería', 'Donas con glaseado de azúcar', 2.50, 120, 150, '/images/donas-glaseadas.jpg', 'A'),
    ('P009', 'Pan de Molde', 'Panadería', 'Pan de molde para sandwiches', 6.00, 40, 50, '/images/pan-molde.jpg', 'A'),
    ('P010', 'Muffins de Arándanos', 'Repostería', 'Muffins con arándanos frescos', 4.00, 35, 50, '/images/muffin-arandanos.jpg', 'A');

-- 7. INSERTAR VENTAS (SALE)
INSERT INTO sale (
    Sale_Code,
    id_Customer,
    id_Employee,
    Sale_Date,
    Payment_Method,
    Status,
    Total
) VALUES 
    ('V001', 1, 3, '2024-03-15', 'Efectivo', 'Completado', 48.50),
    ('V002', 2, 3, '2024-03-15', 'Tarjeta', 'Completado', 35.00),
    ('V003', 3, 4, '2024-03-16', 'Efectivo', 'Completado', 67.50),
    ('V004', 4, 3, '2024-03-16', 'Yape', 'Completado', 28.00),
    ('V005', 5, 4, '2024-03-17', 'Efectivo', 'Completado', 52.00),
    ('V006', 1, 3, '2024-03-17', 'Tarjeta', 'Completado', 31.50),
    ('V007', 6, 4, '2024-03-18', 'Efectivo', 'Completado', 45.00),
    ('V008', 7, 3, '2024-03-18', 'Plin', 'Completado', 38.50),
    ('V009', 8, 4, '2024-03-19', 'Efectivo', 'Completado', 72.00),
    ('V010', 9, 3, '2024-03-19', 'Tarjeta', 'Pendiente', 29.50);

-- 8. INSERTAR DETALLES DE VENTA (SALE_DETAIL)
INSERT INTO sale_detail (
    id_Sale,
    id_Product,
    Quantity,
    Unit_Price,
    Subtotal
) VALUES 
    -- Detalles para V001
    (1, 1, 10, 3.50, 35.00),
    (1, 2, 5, 2.70, 13.50),
    -- Detalles para V002
    (2, 3, 1, 25.00, 25.00),
    (2, 8, 4, 2.50, 10.00),
    -- Detalles para V003
    (3, 4, 1, 22.00, 22.00),
    (3, 5, 10, 4.50, 45.00),
    -- Detalles para V004
    (4, 6, 4, 5.00, 20.00),
    (4, 10, 2, 4.00, 8.00),
    -- Detalles para V005
    (5, 7, 1, 28.00, 28.00),
    (5, 9, 4, 6.00, 24.00),
    -- Detalles para V006
    (6, 1, 5, 3.50, 17.50),
    (6, 8, 6, 2.33, 14.00),
    -- Detalles para V007
    (7, 2, 15, 2.00, 30.00),
    (7, 5, 3, 5.00, 15.00),
    -- Detalles para V008
    (8, 6, 6, 5.00, 30.00),
    (8, 10, 2, 4.25, 8.50),
    -- Detalles para V009
    (9, 3, 2, 25.00, 50.00),
    (9, 4, 1, 22.00, 22.00),
    -- Detalles para V010
    (10, 1, 6, 3.50, 21.00),
    (10, 8, 3, 2.83, 8.50);

-- 9. INSERTAR ITEMS DE ALMACÉN (STORE_ITEM)
INSERT INTO store_item (
    Item_Code,
    Product_Name,
    Category,
    Current_Stock,
    Minimum_Stock,
    Unit,
    Unit_Price,
    id_Supplier,
    Expiry_Date,
    Location,
    Status
) VALUES 
    ('A001', 'Harina de Trigo', 'Ingredientes Básicos', 250, 50, 'kg', 2.50, 1, '2024-06-15', 'Estante A-1', 'Disponible'),
    ('A002', 'Azúcar Blanca', 'Ingredientes Básicos', 180, 30, 'kg', 3.20, 3, '2024-08-20', 'Estante A-2', 'Disponible'),
    ('A003', 'Mantequilla', 'Lácteos', 45, 10, 'kg', 12.50, 2, '2024-04-30', 'Refrigerador B-1', 'Disponible'),
    ('A004', 'Huevos', 'Ingredientes Frescos', 120, 20, 'unidades', 0.80, 4, '2024-04-10', 'Refrigerador B-2', 'Disponible'),
    ('A005', 'Levadura', 'Ingredientes Básicos', 25, 5, 'kg', 8.00, 5, '2024-12-31', 'Estante A-3', 'Disponible'),
    ('A006', 'Chocolate en Polvo', 'Ingredientes Especiales', 35, 8, 'kg', 15.00, 5, '2024-10-15', 'Estante C-1', 'Disponible'),
    ('A007', 'Vainilla Líquida', 'Esencias', 12, 3, 'litros', 25.00, 5, '2024-07-30', 'Estante C-2', 'Stock Bajo'),
    ('A008', 'Sal', 'Ingredientes Básicos', 80, 15, 'kg', 1.50, 1, '2025-12-31', 'Estante A-4', 'Disponible'),
    ('A009', 'Aceite Vegetal', 'Ingredientes Básicos', 40, 8, 'litros', 6.50, 1, '2024-09-15', 'Estante A-5', 'Disponible'),
    ('A010', 'Fresas Frescas', 'Frutas', 8, 15, 'kg', 12.00, 4, '2024-03-25', 'Refrigerador B-3', 'Stock Bajo');

-- 10. INSERTAR COMPRAS (BUY)
INSERT INTO buys (
    Purchase_Date,
    Total_Amount,
    Payment_Type,
    id_Supplier
) VALUES 
    ('2024-03-01', 1250.00, 'Transferencia', 1),
    ('2024-03-02', 850.50, 'Efectivo', 2),
    ('2024-03-03', 2100.75, 'Cheque', 3),
    ('2024-03-05', 680.25, 'Transferencia', 4),
    ('2024-03-08', 1450.00, 'Efectivo', 5),
    ('2024-03-10', 920.80, 'Transferencia', 1),
    ('2024-03-12', 1780.60, 'Cheque', 2),
    ('2024-03-15', 560.40, 'Efectivo', 4);

-- 11. INSERTAR DETALLES DE COMPRA (PURCHASE_DETAIL)
INSERT INTO purchase_details (
    id_Buys,
    id_Product,
    Amount,
    Subtotal
) VALUES 
    -- Detalles para compra 1
    (1, 1, 100.00, 250.00),
    (1, 2, 200.00, 400.00),
    (1, 5, 50.00, 400.00),
    (1, 8, 80.00, 120.00),
    (1, 9, 20.00, 130.00),
    -- Detalles para compra 2
    (2, 3, 15.00, 187.50),
    (2, 4, 80.00, 64.00),
    (2, 10, 50.00, 600.00),
    -- Detalles para compra 3
    (3, 1, 150.00, 375.00),
    (3, 2, 100.00, 320.00),
    (3, 6, 30.00, 450.00),
    (3, 7, 20.00, 500.00),
    (3, 8, 30.00, 45.00),
    -- Detalles para compra 4
    (4, 4, 60.00, 48.00),
    (4, 10, 40.00, 480.00),
    (4, 3, 8.00, 100.00),
    -- Detalles para compra 5
    (5, 6, 25.00, 375.00),
    (5, 7, 15.00, 375.00),
    (5, 5, 35.00, 280.00),
    (5, 9, 30.00, 195.00),
    -- Detalles para compra 6
    (6, 1, 80.00, 200.00),
    (6, 8, 60.00, 90.00),
    (6, 9, 40.00, 260.00),
    (6, 2, 100.00, 320.00),
    -- Detalles para compra 7
    (7, 3, 20.00, 250.00),
    (7, 4, 100.00, 80.00),
    (7, 10, 90.00, 1080.00),
    (7, 6, 25.00, 375.00),
    -- Detalles para compra 8
    (8, 4, 40.00, 32.00),
    (8, 10, 35.00, 420.00),
    (8, 7, 4.00, 100.00);

-- 12. INSERTAR GASTOS (EXPENSE)
INSERT INTO expense (
    id_Employee,
    Description,
    Amount,
    Expense_Date
) VALUES 
    (1, 'Combustible para delivery', 150.00, '2024-03-15'),
    (2, 'Materiales de limpieza', 85.50, '2024-03-16'),
    (3, 'Mantenimiento de caja registradora', 200.00, '2024-03-17'),
    (4, 'Publicidad en redes sociales', 300.00, '2024-03-18'),
    (5, 'Ingredientes especiales', 120.75, '2024-03-19'),
    (6, 'Reparación de horno', 450.00, '2024-03-20'),
    (7, 'Empaques y bolsas', 95.25, '2024-03-21'),
    (8, 'Servicios contables', 500.00, '2024-03-22'),
    (1, 'Viáticos de gestión', 180.00, '2024-03-23'),
    (3, 'Cambio para caja', 1000.00, '2024-03-24');

-- 13. INSERTAR ITEMS DE PROVEEDOR (SUPPLIER_ITEM)
INSERT INTO supplier_item (
    id_Supplier,
    Item_Name,
    Quantity,
    Unit_Price,
    Subtotal,
    Total,
    Status
) VALUES 
    (1, 'Harina Premium', 100, 2.80, 280.00, 280.00, 'A'),
    (1, 'Harina Integral', 50, 3.20, 160.00, 160.00, 'A'),
    (2, 'Mantequilla Sin Sal', 20, 12.00, 240.00, 240.00, 'A'),
    (2, 'Crema de Leche', 15, 8.50, 127.50, 127.50, 'A'),
    (3, 'Azúcar Refinada', 80, 3.00, 240.00, 240.00, 'A'),
    (3, 'Azúcar Rubia', 40, 3.50, 140.00, 140.00, 'A'),
    (4, 'Fresas Premium', 10, 15.00, 150.00, 150.00, 'A'),
    (4, 'Arándanos Frescos', 8, 20.00, 160.00, 160.00, 'A'),
    (5, 'Esencia de Vainilla', 5, 30.00, 150.00, 150.00, 'A'),
    (5, 'Colorante Natural', 12, 8.00, 96.00, 96.00, 'A');

-- 14. INSERTAR USUARIOS (USER)
INSERT INTO users (
    username,
    password,
    role,
    state
) VALUES 
    ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_ADMIN', 'ACTIVE'),
    ('gerente', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_MANAGER', 'ACTIVE'),
    ('cajero1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_CASHIER', 'ACTIVE'),
    ('cajero2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_CASHIER', 'ACTIVE'),
    ('vendedor1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_SELLER', 'ACTIVE'),
    ('vendedor2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_SELLER', 'ACTIVE'),
    ('almacenero', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_WAREHOUSE', 'ACTIVE'),
    ('contador', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLFQf6.zsZO6', 'ROLE_ACCOUNTANT', 'ACTIVE');

-- =====================================================
-- FIN DEL ARCHIVO DATA.SQL
-- =====================================================